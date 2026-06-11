CREATE DATABASE IF NOT EXISTS cloud_share
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE cloud_share;

CREATE TABLE IF NOT EXISTS resources (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  type VARCHAR(30) NOT NULL,
  link VARCHAR(500) NOT NULL,
  extraction_code VARCHAR(12) DEFAULT '',
  description VARCHAR(260) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

TRUNCATE TABLE resources;

INSERT INTO resources (name, type, link, extraction_code, description) VALUES
('前端开发入门课程合集', '课程资料', 'https://pan.baidu.com/s/1demoFrontend', '8x6k', '包含 HTML、CSS、JavaScript 基础视频与练习文件，适合零基础学习。'),
('常用办公模板包', '办公模板', 'https://pan.baidu.com/s/1demoOffice', 'm2q9', '整理了简历、周报、项目计划、合同台账等常用 Word 和 Excel 模板。'),
('UI 设计素材精选', '设计素材', 'https://pan.baidu.com/s/1demoDesign', 'p7d3', '图标、按钮、移动端页面组件和配色参考，适合界面设计练习。'),
('Python 自动化电子书', '电子书', 'https://pan.baidu.com/s/1demoPythonBook', 'r5t1', 'PDF 格式，内容覆盖文件处理、表格处理、网页抓取和任务自动化。'),
('绿色截图与录屏工具', '软件工具', 'https://pan.baidu.com/s/1demoTools', 'k4v8', '免安装小工具合集，包含截图、录屏、图片压缩和格式转换工具。');
