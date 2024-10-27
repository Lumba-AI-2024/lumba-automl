# QUICK INSTALLATION GUIDE

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
