#!/bin/sh

# 尝试运行数据库迁移
echo "Running database migrations..."
npx prisma migrate deploy || {
  echo "Warning: Database migration failed, but continuing startup..."
  echo "The application will use default values for subscription fields."
}

# 启动服务器
echo "Starting server..."
node dist/server.js

