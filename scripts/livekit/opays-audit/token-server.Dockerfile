FROM python:3.11-slim@sha256:90744cff8f32887f075c47d747a173ff333e9e98801667af93c357fa9f5e28ff
WORKDIR /app
RUN pip install --no-cache-dir pyjwt==2.13.0
COPY token_server.py /app/token_server.py
RUN chown -R 10001:10001 /app
USER 10001:10001
EXPOSE 8090
CMD ["python", "-u", "/app/token_server.py"]
