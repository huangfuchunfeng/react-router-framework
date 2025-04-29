const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

// 配置参数
const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, "../build/client"); // 静态文件目录

// 创建服务器
const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url);
    let pathname = path.join(PUBLIC_DIR, parsedUrl.pathname);

    // 安全校验：防止路径穿越攻击
    if (!pathname.startsWith(PUBLIC_DIR)) {
      res.statusCode = 403;
      return res.end("Forbidden");
    }

    // 检查文件是否存在
    const stats = await fs.promises.stat(pathname).catch(() => null);

    if (stats) {
      // 如果是目录，尝试加载 index.html
      if (stats.isDirectory()) {
        pathname = path.join(pathname, "index.html");
        if (!(await fileExists(pathname))) {
          return sendIndexHtml(res);
        }
      }
      return sendFile(res, pathname);
    } else {
      // 没有扩展名的请求走 History 模式
      const hasExtension = path.extname(pathname) !== "";

      if (hasExtension) {
        res.statusCode = 404;
        return res.end("Not Found");
      } else {
        return sendIndexHtml(res);
      }
    }
  } catch (err) {
    res.statusCode = 500;
    res.end("Server Error");
  }
});

// 辅助函数：发送文件
function sendFile(res, filePath) {
  const ext = path.extname(filePath);
  const mimeType = getMimeType(ext);

  res.writeHead(200, {
    "Content-Type": mimeType,
    "Cache-Control": "public, max-age=86400", // 1天缓存
  });

  fs.createReadStream(filePath).pipe(res);
}

// 辅助函数：发送 index.html
function sendIndexHtml(res) {
  const indexPath = path.join(PUBLIC_DIR, "index.html");

  fs.readFile(indexPath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      return res.end("index.html not found");
    }

    res.writeHead(200, {
      "Content-Type": "text/html",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  });
}

// 获取 MIME 类型
function getMimeType(ext) {
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".svg": "image/svg+xml",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

// 检查文件是否存在
async function fileExists(path) {
  try {
    await fs.promises.access(path);
    return true;
  } catch {
    return false;
  }
}

// 启动服务
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
