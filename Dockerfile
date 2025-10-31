FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-selfhosted.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /data

ENV PYTHONUNBUFFERED=1

EXPOSE 8891

CMD ["gunicorn", "-k", "gthread", "-b", ":8891", "main:app", "--timeout", "120", "--workers", "2", "--threads", "1"]
