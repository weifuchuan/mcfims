CREATE TABLE IF NOT EXISTS `国家励志奖学金` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `姓名` VARCHAR(45) NULL,
  `身份证件类型` VARCHAR(45) NULL,
  `身份证件号` VARCHAR(45) NULL,
  `成绩排名总人数` INTEGER NULL,
  `成绩排名` INTEGER NULL,
  `备注` VARCHAR(45) NULL,
  `必修课及格人数` INTEGER NULL,
  `必修课门数` INTEGER NULL,
  `是否实行综合考评排名` TINYINTEGER NULL,
  `综合考评排名名次` INTEGER NULL,
  `综合考评排名总人数` INTEGER NULL,
  `实发金额` DOUBLE NULL,
  `发放日期` VARCHAR(45) NULL);
CREATE INDEX IF NOT EXISTS `国家励志奖学金.NAME` ON `国家励志奖学金`(`姓名` ASC);
CREATE INDEX IF NOT EXISTS `国家励志奖学金.ID_CARD_NUMBER`  ON `国家励志奖学金`(`身份证件号` ASC);
CREATE TABLE IF NOT EXISTS `国家助学金` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `姓名` VARCHAR(45) NULL,
  `身份证件类型` VARCHAR(45) NULL,
  `身份证件号` VARCHAR(45) NULL,
  `资助标准` DOUBLE NULL,
  `应发金额` DOUBLE NULL,
  `实发金额` DOUBLE NULL,
  `发放日期` VARCHAR(45) NULL,
  `申请理由` VARCHAR(45) NULL,
  `备注说明` VARCHAR(200) NULL);
CREATE INDEX IF NOT EXISTS `国家助学金.NAME` ON `国家助学金`(`姓名` ASC);
CREATE INDEX IF NOT EXISTS `国家助学金.ID_CARD_NUMBER` ON `国家助学金`(`身份证件号` ASC);
CREATE TABLE IF NOT EXISTS  `国家生源地助学贷款` (
  `id` INTEGER PRIMARY KEY  AUTOINCREMENT,
  `序号` INTEGER NULL,
  `姓名` VARCHAR(45) NULL,
  `班级` VARCHAR(45) NULL,
  `学号` VARCHAR(45) NULL,
  `生源地省份` VARCHAR(45) NULL,
  `生源地具体地址` VARCHAR(200) NULL,
  `回执校验码` VARCHAR(45) NULL,
  `贷款金额（元）` DOUBLE NULL,
  `是否新申请` VARCHAR(45) NULL,
  `联系方式` VARCHAR(45) NULL);
CREATE INDEX IF NOT EXISTS  `国家生源地助学贷款.NAME` ON `国家生源地助学贷款`(`姓名` ASC);
CREATE INDEX IF NOT EXISTS  `国家生源地助学贷款.CLAZZ` ON `国家生源地助学贷款`(`班级` ASC);
CREATE INDEX IF NOT EXISTS  `国家生源地助学贷款.STUDENT_ID` ON `国家生源地助学贷款`(`学号` ASC);
CREATE TABLE IF NOT EXISTS  `建档立卡_国家资助` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `序号` INTEGER NULL,
  `学生姓名` VARCHAR(45) NULL,
  `身份证号` VARCHAR(45) NULL,
  `学历` VARCHAR(45) NULL,
  `院系` VARCHAR(45) NULL,
  `专业` VARCHAR(45) NULL,
  `学号` VARCHAR(45) NULL,
  `性别` VARCHAR(45) NULL,
  `户口类型` VARCHAR(45) NULL,
  `生源省份` VARCHAR(45) NULL,
  `贫困程度` VARCHAR(45) NULL,
  `家庭人均 年收入（元）` VARCHAR(45) NULL,
  `在读年级` VARCHAR(45) NULL,
  `是否已脱贫建档立卡  家庭学生` VARCHAR(45) NULL);
CREATE INDEX IF NOT EXISTS  `建档立卡_国家资助.NAME` ON `建档立卡_国家资助`(`学生姓名` ASC);
CREATE INDEX IF NOT EXISTS  `建档立卡_国家资助.NUMBER` ON `建档立卡_国家资助`(`序号` ASC);
CREATE INDEX IF NOT EXISTS  `建档立卡_国家资助.ID_CARD_NUMBER` ON `建档立卡_国家资助`(`身份证号` ASC);
CREATE INDEX IF NOT EXISTS  `建档立卡_国家资助.STUDENT_ID` ON `建档立卡_国家资助`(`学号` ASC);
CREATE INDEX IF NOT EXISTS  `建档立卡_国家资助.ACADEMY` ON `建档立卡_国家资助`(`院系` ASC);
CREATE INDEX IF NOT EXISTS  `建档立卡_国家资助.PROFESSION` ON `建档立卡_国家资助`(`专业` ASC);
CREATE TABLE IF NOT EXISTS  `食堂补贴` (
  `id` INTEGER PRIMARY KEY  AUTOINCREMENT,
  `学生姓名` VARCHAR(45) NULL,
  `身份证件类型` VARCHAR(45) NULL,
  `身份证件号` VARCHAR(45) NULL,
  `资助名称` VARCHAR(45) NULL,
  `资助金额` DOUBLE NULL,
  `发放日期` VARCHAR(45) NULL,
  `发放人` VARCHAR(45) NULL);
CREATE INDEX IF NOT EXISTS  `食堂补贴.NAME` ON `食堂补贴`(`学生姓名` ASC);
CREATE INDEX IF NOT EXISTS  `食堂补贴.ID_CARD_NUMBER` ON `食堂补贴`(`身份证件号` ASC);
CREATE TABLE IF NOT EXISTS  `寒假回家路费` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `序号` INTEGER NULL,
  `姓名` VARCHAR(45) NULL,
  `性别` VARCHAR(45) NULL,
  `学院` VARCHAR(45) NULL,
  `专业班级` VARCHAR(45) NULL,
  `交行卡号` VARCHAR(45) NULL,
  `金额（元）` DOUBLE NULL,
  `民族` VARCHAR(45) NULL,
  `家庭所在地(具体到乡镇)` VARCHAR(200) NULL
  );
CREATE INDEX IF NOT EXISTS  `寒假回家路费.NAME` ON `寒假回家路费`(`姓名` ASC);
CREATE INDEX IF NOT EXISTS  `寒假回家路费.NUMBER` ON `寒假回家路费`(`序号` ASC);
CREATE INDEX IF NOT EXISTS  `寒假回家路费.ACADEMY` ON `寒假回家路费`(`学院` ASC);
CREATE INDEX IF NOT EXISTS  `寒假回家路费.PROFESSION` ON `寒假回家路费`(`专业班级` ASC);
CREATE TABLE IF NOT EXISTS  `助育兼容促双创学生奖励` (
  `id` INTEGER  PRIMARY KEY AUTOINCREMENT,
  `序号` INTEGER NULL,
  `姓名` VARCHAR(45) NULL,
  `班级` VARCHAR(100) NULL,
  `学号` VARCHAR(45) NULL,
  `联系方式` VARCHAR(45) NULL,
  `交通银行卡号` VARCHAR(45) NULL,
  `发放金额（元）` DOUBLE NULL,
  `项目名称` VARCHAR(45) NULL,
  `所获奖项` VARCHAR(45) NULL,
  `获奖时间` VARCHAR(45) NULL,
  `获奖级别` VARCHAR(45) NULL,
  `备注` VARCHAR(200) NULL);
CREATE INDEX IF NOT EXISTS  `助育兼容促双创学生奖励.NUMBER` ON `助育兼容促双创学生奖励`(`序号` ASC);
CREATE INDEX IF NOT EXISTS  `助育兼容促双创学生奖励.NAME`  ON `助育兼容促双创学生奖励`(`姓名` ASC);
CREATE INDEX IF NOT EXISTS  `助育兼容促双创学生奖励.STUDENT_ID`  ON `助育兼容促双创学生奖励`(`学号` ASC);
CREATE INDEX IF NOT EXISTS  `助育兼容促双创学生奖励.CLAZZ`  ON `助育兼容促双创学生奖励`(`班级` ASC);
CREATE INDEX IF NOT EXISTS  `助育兼容促双创学生奖励.PRODUCT_NAME`  ON `助育兼容促双创学生奖励`(`项目名称` ASC);
CREATE TABLE IF NOT EXISTS `精进助学金` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `学生姓名` VARCHAR(45) NULL,
  `身份证件类型` VARCHAR(45) NULL,
  `身份证件号` VARCHAR(45) NULL,
  `资助名称` VARCHAR(45) NULL,
  `资助金额` DOUBLE NULL,
  `发放日期` VARCHAR(45) NULL,
  `发放人` VARCHAR(45) NULL);
CREATE INDEX IF NOT EXISTS  `精进助学金.NAME` on `精进助学金`(`学生姓名` ASC);
CREATE INDEX IF NOT EXISTS  `精进助学金.ID_CARD_NUMBER` ON `精进助学金`(`身份证件号` ASC);
CREATE INDEX IF NOT EXISTS  `精进助学金.TYPE` ON `精进助学金`(`资助名称` ASC);
CREATE TABLE IF NOT EXISTS `真维斯助学金` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `学生姓名` VARCHAR(45) NULL,
  `身份证件类型` VARCHAR(45) NULL,
  `身份证件号` VARCHAR(45) NULL,
  `资助名称` VARCHAR(45) NULL,
  `资助金额` DOUBLE NULL,
  `发放日期` VARCHAR(45) NULL,
  `发放人` VARCHAR(45) NULL);
CREATE INDEX IF NOT EXISTS  `真维斯助学金.NAME` on `真维斯助学金`(`学生姓名` ASC);
CREATE INDEX IF NOT EXISTS  `真维斯助学金.ID_CARD_NUMBER` ON `真维斯助学金`(`身份证件号` ASC);
CREATE INDEX IF NOT EXISTS  `真维斯助学金.TYPE` ON `真维斯助学金`(`资助名称` ASC);
CREATE TABLE IF NOT EXISTS `国酒茅台助学金` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `学生姓名` VARCHAR(45) NULL,
  `身份证件类型` VARCHAR(45) NULL,
  `身份证件号` VARCHAR(45) NULL,
  `资助名称` VARCHAR(45) NULL,
  `资助金额` DOUBLE NULL,
  `发放日期` VARCHAR(45) NULL,
  `发放人` VARCHAR(45) NULL);
CREATE INDEX IF NOT EXISTS  `国酒茅台助学金.NAME` on `国酒茅台助学金`(`学生姓名` ASC);
CREATE INDEX IF NOT EXISTS  `国酒茅台助学金.ID_CARD_NUMBER` ON `国酒茅台助学金`(`身份证件号` ASC);
CREATE INDEX IF NOT EXISTS  `国酒茅台助学金.TYPE` ON `国酒茅台助学金`(`资助名称` ASC);