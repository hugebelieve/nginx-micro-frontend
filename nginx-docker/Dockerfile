FROM nginx

COPY watcher.sh /app/

ENTRYPOINT service nginx start && /bin/bash "./app/watcher.sh"

# RUN /app/watcher.sh