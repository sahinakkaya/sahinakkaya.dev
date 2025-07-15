FROM ruby:3.1-alpine

RUN apk add --no-cache \
    build-base \
    git \
    tzdata \
    nodejs \
    npm

WORKDIR /app

COPY Gemfile Gemfile.lock ./

RUN bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install

COPY . .

RUN bundle exec jekyll build

FROM nginx:alpine

COPY --from=0 /app/_site /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]