CREATE DATABASE  IF NOT EXISTS `ch1` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `ch1`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
--
-- Host: localhost    Database: ch1
-- ------------------------------------------------------
-- Server version	5.7.22-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `session_settings`
--

DROP TABLE IF EXISTS `session_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `multi_login` bit(1) DEFAULT NULL,
  `max_try` int(11) DEFAULT NULL,
  `retry_interval` int(11) DEFAULT NULL,
  `login_expire` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_settings`
--

LOCK TABLES `session_settings` WRITE;
/*!40000 ALTER TABLE `session_settings` DISABLE KEYS */;
INSERT INTO `session_settings` VALUES (1,'',9999,5,5);
/*!40000 ALTER TABLE `session_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `is_cust` int(50) DEFAULT NULL,
  `fullname` varchar(50) DEFAULT NULL,
  `roleid` int(11) DEFAULT NULL,
  `deptid` int(11) DEFAULT NULL,
  `cusid` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `areaid` int(11) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('admin','admin','',NULL,'admin',1,1,NULL,1,NULL,'2018-08-23 13:46:11'),('hades','hades','3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d',NULL,'hades',3,27,NULL,1,NULL,'2018-08-30 11:15:46'),('jack','jack','',NULL,'jack',2,29,NULL,1,NULL,'2018-09-03 13:45:44'),('sa','sa','7c4a8d09ca3762af61e59520943dc26494f8941b',1,'saname',1,0,NULL,NULL,NULL,'2018-07-04 13:29:58'),('test2','test2','7c4a8d09ca3762af61e59520943dc26494f8941b',NULL,'test',5,9,NULL,NULL,NULL,'2018-07-04 13:51:14'),('test5','test5','7c4a8d09ca3762af61e59520943dc26494f8941b',NULL,'ttesat1',5,8,NULL,1,NULL,'2018-07-04 14:11:45'),('test6','test6','7c4a8d09ca3762af61e59520943dc26494f8941b',NULL,'test6',5,8,NULL,1,NULL,'2018-08-05 06:07:31'),('test7','test7','7c4a8d09ca3762af61e59520943dc26494f8941b',NULL,'test7',5,8,NULL,1,NULL,'2018-08-05 06:09:32'),('test8','test8','7c4a8d09ca3762af61e59520943dc26494f8941b',NULL,'test8',5,8,NULL,1,NULL,'2018-08-05 06:11:30'),('tk','tk','',NULL,'坦克',2,25,NULL,1,NULL,'2018-09-05 05:47:00'),('tom','tom','3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d',NULL,'tom',2,27,NULL,1,NULL,'2018-09-03 07:16:03');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dev`@`%`*/ /*!50003 TRIGGER `user_AINS` AFTER INSERT ON `user` FOR EACH ROW
BEGIN
   DECLARE rs_count INT;
    DECLARE newid INT(11);
    DECLARE srv_ip VARCHAR(15);
    DECLARE p_dkey VARCHAR(100);
    SELECT SERVER INTO srv_ip FROM chmicroconf ORDER BY id LIMIT 1;
    SELECT COUNT(1) INTO rs_count FROM chmicroconf WHERE ac = new.username;
    SELECT dkey INTO p_dkey FROM departments WHERE id = new.deptid;
    IF rs_count = 0 THEN
      INSERT INTO chmicroconf(ac,SERVER,pname,pstype) VALUES(new.username, srv_ip, "1234", "16");
      SELECT max(id) from chmicroconf into newid;
	  UPDATE chmicroconf set uid=CONCAT(newid + 10000100000000000000,"") where id=newid;
	END IF ;
    IF new.type = 1 THEN
	INSERT INTO person(pno,NAME,deptid,dkey,TYPE) VALUES(new.username,new.username,new.deptid,p_dkey,new.type);
    END IF; 
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dev`@`%`*/ /*!50003 TRIGGER `user_ADEL` AFTER DELETE ON `user` FOR EACH ROW
BEGIN
   DELETE FROM chmicroconf WHERE ac = old.username;
    IF old.type = 1 THEN
	 DELETE FROM person WHERE pno = old.username AND TYPE=old.type;
    END IF; 
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-09-30 15:10:52
