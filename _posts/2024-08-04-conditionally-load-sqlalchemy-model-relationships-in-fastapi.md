---
title:  "Conditionally load SQLAlchemy model relationships in FastAPI"
date: 2024-08-04 12:55:01  +0300
tags:  fastapi sqlalchemy pydantic
---

Suppose you have a FastAPI app responsible for talking with database via sqlalchemy and retrieving data. The sqlalchemy models have some `relationship`s and the job of your app is exposing this database models with or without relationships based on the operation. You can't make use of relationship loading strategies (`'selectin'`, `'joined'` etc.) because FastAPI tries to convert the result to pydantic schemas and pydantic tries to load the relationship even though you don't need it to load for that specific operation. There are three things you can do: 

1. Define the loading strategy in your sqlalchemy models and create different pydantic schemas for the same entity including/excluding different fields. (i.e. if you don't need to load `Book.reviews` for specific endpoint, create a new pydantic schema for books without including `reviews`). After that, create different routes for returning correct schema. (`get_books_with_reviews`, `get_books_without_reviews` etc.)

This is the easiest option. Once you decided how each field should be loaded, you only need to create different pydantic schema for loading different fields. The downside is that you will have a lot of schemas and maintaining them will be hard.
2. Create a pydantic schema with all fields and declare some fields as nullable. Do not load anything by default in sqlalchemy models (`lazy='noload'`).  Create different routes returning the same schema but inside the routes, manually edit the `query.options` to load different fields.

This is what we were doing in our project. Only implementing the routes that we need 90% of the time was working fine for us. If we need more data, we were doing a second request to our API and merging the results. This becomes tedious after some time which is why we decided to move away from it.
3. Somehow get the loading options as input from users of your API and return what is requested. 

That's it! If such endpoint exists all our problems would be solved. In this post, we will implement that!

![One endpoint to rule them all](/assets/images/sqlalchemy/ring.jpg)


I will first include code snippets which doesn't have any special logic then add the solution at the end. Here is the database schema I will use:

![DB Schema](/assets/images/sqlalchemy/schema.png)


Let's create our sqlalchemy models:

```python
# models.py
from sqlalchemy import ForeignKey, create_engine
from sqlalchemy.orm import (
    Mapped,
    Session,
    mapped_column,
    relationship,
    DeclarativeBase,
)


class Base(DeclarativeBase):
    pass


class Author(Base):
    __tablename__ = "authors"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column()
    awards = relationship("Award", lazy="noload")

    books: Mapped[list["Book"]] = relationship(lazy="noload", back_populates="author")


class Award(Base):
    __tablename__ = "awards"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"))
    name: Mapped[str] = mapped_column()
    year: Mapped[int] = mapped_column()


class Book(Base):
    __tablename__ = "books"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column()
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"), nullable=True)

    reviews: Mapped[list["Review"]] = relationship(lazy="noload", back_populates="book")
    author = relationship("Author", lazy="noload", back_populates="books")


class Review(Base):
    __tablename__ = "reviews"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    text: Mapped[str] = mapped_column()
    book_id: Mapped[int] = mapped_column(ForeignKey("books.id"))

    book: Mapped["Book"] = relationship(lazy="noload")

```

These are our database models. For the sake of our example, I will include the code to add some data to our database.
```python
# models.py

engine = create_engine("sqlite://", echo=True)
Base.metadata.create_all(engine)


session = Session(engine)
with session.begin():
    book1 = Book(title="Book 1")
    session.add(book1)
    session.flush()
    review1 = Review(text="Review 1", book_id=book1.id)
    review2 = Review(text="Review 2", book_id=book1.id)
    session.add_all([review1, review2])
    session.flush()

    author = Author(name="Author 1")
    session.add(author)
    session.flush()
    book2 = Book(title="Book 2", author_id=author.id)
    book1.author_id = author.id
    session.add(book2)
    session.add(book1)
    session.flush()

    author2 = Author(
        name="Author 2",
        awards=[Award(name="Award 1", year=2021), Award(name="Award 2", year=2024)],
    )
    session.add(author2)
    session.flush()
    book3 = Book(title="Book 3", author_id=author2.id)
    session.add(book3)

    session.flush()
    review3 = Review(text="Review 3", book_id=book3.id)
    session.add(review3)
    session.flush()
```


Now that we have our database ready, let's create pydantic schemas

```python
# schemas.py
from pydantic import BaseModel


class ReviewSchema(BaseModel):
    id: int
    text: str
    book_id: int
    book: "BookSchema | None" = None


class BookSchema(BaseModel):
    id: int
    title: str
    author_id: int
    author: "AuthorSchema | None" = None
    reviews: list[ReviewSchema] = []


class AwardSchema(BaseModel):
    id: int
    name: str
    year: int


class AuthorSchema(BaseModel):
    id: int
    name: str
    books: list[BookSchema] = []
    awards: list[AwardSchema] = []

```

And lastly, we need to initialize FastAPI app to interact with our database. Let's create a very simple app for exposing `Author`s and `Review`s outside.

```python
from fastapi import FastAPI
from models import Author, engine
from schemas import AuthorSchema, ReviewSchema
from sqlalchemy.orm import Session


app = FastAPI()

@app.get("/authors", response_model=list[AuthorSchema])
async def get_authors():
    session = Session(engine)
    query = session.query(Author)
    return query.all()


@app.get("/reviews", response_model=list[ReviewSchema])
async def get_reviews():
    session = Session(engine)
    query = session.query(Review)
    result = query.all()
    return result

```
Let's test to see if we are at the same point. Run `uvicorn app:app --reload` then perform a GET request for `/authors` endpoint. You should see two authors returned:

```sh

❯ curl -X 'GET' \
  'http://127.0.0.1:8000/authors' \
  -H 'accept: application/json' | jq
[
  {
    "id": 1,
    "name": "Author 1",
    "books": [],
    "awards": []
  },
  {
    "id": 2,
    "name": "Author 2",
    "books": [],
    "awards": []
  }
]
```

Now, let's start implementing what's required to load different fields based on user input. First of all, we need to have a way to determine the relationships of our database models. Then we will use these relationships to generate pydantic schemas which represents loading options. We will then use these schemas as input to our endpoint and inside our endpoint, we will load required fields.


1. Define a `RelationshipLoader` class in `models.py`.

```python
from typing import Any
from sqlalchemy.inspection import inspect
from sqlalchemy.orm import (
    joinedload,
    selectinload,
)


class RelationshipLoader:
    @classmethod
    def get_relationships(cls) -> dict[str, Any]:
        relationships = cls._get_relationships()
        result = {}
        for key, strategy in relationships.items():
            if strategy.get("selectinload"):
                result[key] = selectinload(*strategy["selectinload"])
            else:
                result[key] = joinedload(*strategy["joinedload"])
        return result

    @classmethod
    def _get_relationships(cls, exclude_classes=None) -> dict[str, Any]:
        if exclude_classes is None:
            exclude_classes = []

        relationships = {}
        mapper = inspect(cls)
        for rel in mapper.relationships:
            if rel.mapper.class_ in exclude_classes:
                continue
            load_strategy = ( # if it is a one to one or many to one relationship we are loading it with selectinload strategy, else joinedload
                {"selectinload": [getattr(cls, rel.key)]}
                if rel.direction.name in ["MANYTOONE", "ONETOMANY"]
                else {"joinedload": getattr(cls, rel.key)}
            )
            relationships[rel.key] = load_strategy

            # Recursively inspect nested relationships
            target_cls = rel.mapper.class_
            if issubclass(target_cls, RelationshipLoader):
                nested_relationships = target_cls._get_relationships(
                    [*exclude_classes, cls] # excluding the current class because we don't want bidirectional relationships to create infinite loop
                )
                for nested_rel, nested_strategy in nested_relationships.items():
                    # if it is a nested relationship, I am assuming it should be loaded with selectinload.
                    # i don't know a better way to handle this but this is working fine for us.
                    combined = load_strategy["selectinload"].copy()
                    combined.extend(nested_strategy["selectinload"])
                    combined = {"selectinload": combined}
                    relationships[f"{rel.key}.{nested_rel}"] = combined

        return relationships

```

Alter the `Base` definition to inherit from `RelationshipLoader` class. With this way, all the other models inheriting from `Base` will be also subclass of `RelationshipLoader`.

```python

class Base(DeclarativeBase, RelationshipLoader):
    pass
```

This is all we need to do for our sqlalchemy models. Now, let's implement the function for generating pydantic schemas dynamically.

```python
# schemas.py


from typing import Any
from pydantic import create_model

def generate_pydantic_model(model_name, strategies: dict[str, Any]) -> type[BaseModel]:
    pydantic_fields = dict.fromkeys(strategies, (bool | None, None))
    return create_model(model_name, **pydantic_fields)
```

And lastly, let's use this function in `app.py` to generate pydantic schemas and use it in our router:

```python
# app.py

from schemas import generate_pydantic_model

AuthorRelationships = Author.get_relationships()
AuthorLoadOptions = generate_pydantic_model("AuthorModel", AuthorRelationships)

ReviewRelationships = Review.get_relationships()
ReviewLoadOptions = generate_pydantic_model("ReviewModel", ReviewRelationships)


@app.post("/authors", response_model=list[AuthorSchema])
async def get_authors(options: AuthorLoadOptions):
    session = Session(engine)
    query = session.query(Author)
    for field, value in options:
        if value:
            query = query.options(AuthorRelationships[field])
    return query.all()


@app.post("/reviews", response_model=list[ReviewSchema])
async def get_reviews(options: ReviewLoadOptions):
    session = Session(engine)
    query = session.query(Review)
    for field, value in options:
        if value:
            query = query.options(ReviewRelationships[field])
    result = query.all()
    return result

```

And that's all! If everything went fine, you should be able to load your database models with whatever fields you like:

```sh
❯ curl -X 'POST' \
  'http://127.0.0.1:8000/authors' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "awards": true,
  "books": false,
  "books.reviews": false
}' | jq

[
  {
    "id": 1,
    "name": "Author 1",
    "books": [],
    "awards": []
  },
  {
    "id": 2,
    "name": "Author 2",
    "books": [],
    "awards": [
      {
        "id": 1,
        "name": "Award 1",
        "year": 2021
      },
      {
        "id": 2,
        "name": "Award 2",
        "year": 2024
      }
    ]
  }
]

❯ curl -X 'POST' \
  'http://127.0.0.1:8000/reviews' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "book": true,
  "book.author": true,
  "book.author.awards": false
}' | jq

[
  {
    "id": 1,
    "text": "Review 1",
    "book_id": 1,
    "book": {
      "id": 1,
      "title": "Book 1",
      "author_id": 1,
      "author": {
        "id": 1,
        "name": "Author 1",
        "books": [],
        "awards": []
      },
      "reviews": []
    }
  },
  {
    "id": 2,
    "text": "Review 2",
    "book_id": 1,
    "book": {
      "id": 1,
      "title": "Book 1",
      "author_id": 1,
      "author": {
        "id": 1,
        "name": "Author 1",
        "books": [],
        "awards": []
      },
      "reviews": []
    }
  },
  {
    "id": 3,
    "text": "Review 3",
    "book_id": 3,
    "book": {
      "id": 3,
      "title": "Book 3",
      "author_id": 2,
      "author": {
        "id": 2,
        "name": "Author 2",
        "books": [],
        "awards": []
      },
      "reviews": []
    }
  }
]

```

You may notice that our endpoints are now accepting POST request. If you want to perform the same thing with GET request, you will need to convert the options to query params. I will explain how it can be done in my next post. Stay tuned!
