# Lumba.ai AutoML

Our own (fullstack) AutoML implementation for Lumba.ai. Made with Django + React. Permalink: [https://github.com/Lumba-AI-2024/lumba-automl](https://github.com/Lumba-AI-2024/lumba-automl)

Stacks:
- Django + DRF + DjangoRQ
- React
- Redis
- MinIO (AWS S3 compatible)
- PostgreSQL

## Authors
- [Adella Rakha](https://github.com/adellara)
- [Gregorius Bhisma](https://github.com/gbhisma)
- [M. Bryan Mahdavikhia](https://github.com/bryanmahdavikhia)
  
Faculty of Computer Science, Universitas Indonesia

## QUICK INSTALLATION GUIDE

> [!WARNING]  
> .env files are pushed into the repository as examples. Do not forget to add `.env` to the `.gitignore` files! Make sure you do not push any critical information publicly.

## 1. Prepare the infrastructure stacks

```bash
docker compose -f .\docker-compose.infra.yaml up -d
```

## 2. Get MinIO's Secret Keys

1. Go to http://localhost:9001/ and log in with the credentials in the compose file:

    ```
    username: minioadmin
    password: minioadmin
    ```

2. Go to User > Access Key > Create access key. An access key that inherit the user's pemission will be generated. Save the keys and copy/paste it to the `./lumba-api/.env` file.

## 3. Run the rest of the stack

```bash
docker compose -f .\docker-compose.app.yaml up -d
```

---
