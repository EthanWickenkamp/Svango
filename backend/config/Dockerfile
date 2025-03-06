FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    bash \
    pkg-config\
    build-essential\
    python3-dev\
    default-mysql-client \
    default-libmysqlclient-dev\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app 

COPY ./config/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

