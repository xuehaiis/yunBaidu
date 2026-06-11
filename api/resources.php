<?php

declare(strict_types=1);

require __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';

    if ($method === 'GET') {
        jsonResponse(['data' => listResources()]);
    }

    $payload = readJson();

    if ($method === 'POST' && $action === 'restore') {
        restoreDemoResources();
        jsonResponse(['data' => listResources()]);
    }

    if ($method === 'POST') {
        $item = saveResource($payload);
        jsonResponse(['data' => $item], 201);
    }

    if ($method === 'PUT') {
        $item = saveResource($payload);
        jsonResponse(['data' => $item]);
    }

    if ($method === 'DELETE') {
        $id = (int)($payload['id'] ?? 0);
        if ($id <= 0) {
            jsonResponse(['message' => '缺少要删除的资料 ID'], 422);
        }
        deleteResource($id);
        jsonResponse(['data' => listResources()]);
    }

    jsonResponse(['message' => '不支持的请求方式'], 405);
} catch (Throwable $e) {
    jsonResponse(['message' => $e->getMessage()], 500);
}

function listResources(): array
{
    $stmt = db()->query(
        'SELECT id, name, type, link, extraction_code AS code, description AS `desc`
         FROM resources
         ORDER BY id DESC'
    );

    return $stmt->fetchAll();
}

function saveResource(array $payload): array
{
    $id = (int)($payload['id'] ?? 0);
    $name = trim((string)($payload['name'] ?? ''));
    $type = trim((string)($payload['type'] ?? ''));
    $link = trim((string)($payload['link'] ?? ''));
    $code = trim((string)($payload['code'] ?? ''));
    $desc = trim((string)($payload['desc'] ?? ''));

    if ($name === '' || $type === '' || $link === '' || $desc === '') {
        jsonResponse(['message' => '资料名称、类型、网盘链接和说明不能为空'], 422);
    }

    if (!filter_var($link, FILTER_VALIDATE_URL)) {
        jsonResponse(['message' => '网盘链接格式不正确'], 422);
    }

    if ($id > 0) {
        $stmt = db()->prepare(
            'UPDATE resources
             SET name = ?, type = ?, link = ?, extraction_code = ?, description = ?
             WHERE id = ?'
        );
        $stmt->execute([$name, $type, $link, $code, $desc, $id]);
    } else {
        $stmt = db()->prepare(
            'INSERT INTO resources (name, type, link, extraction_code, description)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([$name, $type, $link, $code, $desc]);
        $id = (int)db()->lastInsertId();
    }

    $stmt = db()->prepare(
        'SELECT id, name, type, link, extraction_code AS code, description AS `desc`
         FROM resources
         WHERE id = ?'
    );
    $stmt->execute([$id]);
    $item = $stmt->fetch();

    if (!$item) {
        jsonResponse(['message' => '资料不存在或保存失败'], 404);
    }

    return $item;
}

function deleteResource(int $id): void
{
    $stmt = db()->prepare('DELETE FROM resources WHERE id = ?');
    $stmt->execute([$id]);
}

function restoreDemoResources(): void
{
    $items = [
        ['前端开发入门课程合集', '课程资料', 'https://pan.baidu.com/s/1demoFrontend', '8x6k', '包含 HTML、CSS、JavaScript 基础视频与练习文件，适合零基础学习。'],
        ['常用办公模板包', '办公模板', 'https://pan.baidu.com/s/1demoOffice', 'm2q9', '整理了简历、周报、项目计划、合同台账等常用 Word 和 Excel 模板。'],
        ['UI 设计素材精选', '设计素材', 'https://pan.baidu.com/s/1demoDesign', 'p7d3', '图标、按钮、移动端页面组件和配色参考，适合界面设计练习。'],
        ['Python 自动化电子书', '电子书', 'https://pan.baidu.com/s/1demoPythonBook', 'r5t1', 'PDF 格式，内容覆盖文件处理、表格处理、网页抓取和任务自动化。'],
        ['绿色截图与录屏工具', '软件工具', 'https://pan.baidu.com/s/1demoTools', 'k4v8', '免安装小工具合集，包含截图、录屏、图片压缩和格式转换工具。'],
    ];

    $pdo = db();
    $pdo->beginTransaction();
    $pdo->exec('DELETE FROM resources');
    $stmt = $pdo->prepare(
        'INSERT INTO resources (name, type, link, extraction_code, description)
         VALUES (?, ?, ?, ?, ?)'
    );

    foreach ($items as $item) {
        $stmt->execute($item);
    }

    $pdo->commit();
}

function readJson(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);

    return is_array($data) ? $data : [];
}

function jsonResponse(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
