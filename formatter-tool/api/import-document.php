<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['message' => '不支持的请求方式'], 405);
    }

    if (!isset($_FILES['document']) || !is_uploaded_file($_FILES['document']['tmp_name'])) {
        jsonResponse(['message' => '请先选择要导入的文件'], 422);
    }

    $file = $_FILES['document'];
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if ($extension === 'txt') {
        jsonResponse(['text' => readTextFile($file['tmp_name'])]);
    }

    if ($extension === 'docx') {
        jsonResponse(['text' => readDocxFile($file['tmp_name'])]);
    }

    if ($extension === 'doc') {
        jsonResponse(['message' => '暂不支持旧版 .doc 二进制文件，请先用 Word 另存为 .docx 后再导入'], 422);
    }

    jsonResponse(['message' => '仅支持 txt、docx 文件'], 422);
} catch (Throwable $e) {
    jsonResponse(['message' => $e->getMessage()], 500);
}

function readTextFile(string $path): string
{
    $content = file_get_contents($path);

    if ($content === false) {
        jsonResponse(['message' => '文件读取失败'], 500);
    }

    if (preg_match('//u', $content) !== 1) {
        $converted = @iconv('GBK', 'UTF-8//IGNORE', $content);
        if ($converted !== false) {
            $content = $converted;
        }
    }

    return trim(preg_replace('/^\xEF\xBB\xBF/', '', $content) ?? $content);
}

function readDocxFile(string $path): string
{
    if (!class_exists('ZipArchive')) {
        jsonResponse(['message' => '服务器未启用 ZipArchive，无法解析 docx 文件'], 500);
    }

    $zip = new ZipArchive();
    if ($zip->open($path) !== true) {
        jsonResponse(['message' => 'docx 文件打开失败'], 422);
    }

    $xml = $zip->getFromName('word/document.xml');
    $zip->close();

    if ($xml === false) {
        jsonResponse(['message' => 'docx 文件内容不完整'], 422);
    }

    $dom = new DOMDocument();
    $dom->loadXML($xml, LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($dom);
    $xpath->registerNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');

    $paragraphs = [];
    foreach ($xpath->query('//w:body/w:p') as $paragraph) {
        $parts = [];
        foreach ($xpath->query('.//w:t', $paragraph) as $textNode) {
            $parts[] = $textNode->textContent;
        }

        $line = trim(implode('', $parts));
        if ($line !== '') {
            $paragraphs[] = $line;
        }
    }

    return implode("\n\n", $paragraphs);
}

function jsonResponse(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
