FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir pyjwt
COPY token_server.py /app/token_server.py
EXPOSE 8090
CMD ["python", "-u", "/app/token_server.py"]
