#!/bin/sh

# 尝试运行数据库迁移，最多重试3次
echo "Running database migrations..."
RETRY_COUNT=0
MAX_RETRIES=3

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if npx prisma migrate deploy; then
    echo "Migration completed successfully!"
    break
  else
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "Migration failed, retrying... ($RETRY_COUNT/$MAX_RETRIES)"
      sleep 5
    else
      echo "Warning: Database migration failed after $MAX_RETRIES attempts, but continuing startup..."
      echo "The application will use default values for subscription fields."
    fi
  fi
done

# 启动服务器
echo "Starting server..."
node dist/server.js


