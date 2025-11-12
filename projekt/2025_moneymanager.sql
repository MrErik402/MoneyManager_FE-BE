-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 12. 09:18
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `2025_moneymanager`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
('5d0e8ac0-431c-4108-a7bf-fcf445a98d98', 'Étterem'),
('85b69aff-5bfc-4c74-bf76-a72c100dc98e', 'Felmondás'),
('b8181ecb-4ced-4c8e-b728-ee52d02f0582', 'Fizetés'),
('f8399c2b-9730-4b85-9480-535ad266fc94', 'Italozás'),
('fcfb7d67-6710-4c3d-a1f4-ab8c5aac3e95', 'Szórakozás');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(255) NOT NULL,
  `userID` varchar(255) NOT NULL,
  `severity` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `notifications`
--

INSERT INTO `notifications` (`id`, `userID`, `severity`, `title`, `message`, `createdAt`) VALUES
('097474a9-2cfa-46e7-a156-b511d1180f36', '1b50e492-6d0c-4229-a40e-19d990e85839', 'info', 'Negatív egyenleg', 'A(z) reccs pénztárcád egyenlege -4000 Ft.', '2025-10-31 18:55:33'),
('2339035d-8dc5-44c0-aa66-e190070b913e', '1b50e492-6d0c-4229-a40e-19d990e85839', 'info', 'Túl sok pénzed van. A napokban meg fog keresni a NAV.', 'A(z) reccs pénztárcád egyenlege 100551560 Ft, ami 10 000 000 Ft felett van.', '2025-10-31 18:57:43'),
('2480c7bc-77a5-4660-9b44-e03542bc350e', '1b50e492-6d0c-4229-a40e-19d990e85839', 'info', 'Negatív egyenleg', 'A(z) reccs pénztárcád egyenlege -4500 Ft.', '2025-10-31 18:55:03'),
('2de0c603-76a9-44bc-83e8-a7de094c1e4d', '1b50e492-6d0c-4229-a40e-19d990e85839', 'info', 'Negatív egyenleg', 'A(z) reccs pénztárcád egyenlege -4500 Ft.', '2025-10-31 18:55:46'),
('302abcd0-d215-43d9-a8b6-339c7a19766f', '1b50e492-6d0c-4229-a40e-19d990e85839', 'warning', 'Alacsony egyenleg', 'A(z) revolut pénztárcád egyenlege 0 Ft, ami 1000 Ft alatt van.', '2025-10-31 19:00:25'),
('38609a48-a774-4722-89bf-ba13e732e9c3', '1b50e492-6d0c-4229-a40e-19d990e85839', 'info', 'Negatív egyenleg', 'A(z) revolut pénztárcád egyenlege -5000 Ft.', '2025-10-31 19:01:32'),
('4b3f1e73-8941-4fc5-96fd-c249ed008ae6', '1b50e492-6d0c-4229-a40e-19d990e85839', 'info', 'Negatív egyenleg', 'A(z) revolut pénztárcád egyenlege -5010 Ft.', '2025-10-31 19:02:52'),
('54198d26-6920-4123-8273-9bb9da03eac4', '1b50e492-6d0c-4229-a40e-19d990e85839', 'info', 'Túl sok pénzed van. A napokban meg fog keresni a NAV.', 'A(z) rev pénztárcád egyenlege 19998000 Ft, ami 10 000 000 Ft felett van.', '2025-10-31 18:50:27'),
('5efdfcf4-2706-427f-8c67-a1c93a0b9d9c', '2afef064-52da-4a5e-90e6-01a21b5fef83', 'warning', 'Alacsony egyenleg', 'A(z) Fő pénztárcád egyenlege 519 Ft, ami 1000 Ft alatt van.', '2025-10-31 19:32:21'),
('66643138-7b8a-4592-9081-2e152c65bd4a', '1b50e492-6d0c-4229-a40e-19d990e85839', 'info', 'Negatív egyenleg', 'A(z) revolut pénztárcád egyenlege -5010 Ft.', '2025-10-31 19:17:42'),
('9234acd4-7096-4702-805f-c67e51cb390b', '1b50e492-6d0c-4229-a40e-19d990e85839', 'info', 'Túl sok pénzed van. A napokban meg fog keresni a NAV.', 'A(z) reccs pénztárcád egyenlege 100546560 Ft, ami 10 000 000 Ft felett van.', '2025-10-31 18:58:08'),
('9f4335d4-0806-457d-b0be-dba964a3290b', '1b50e492-6d0c-4229-a40e-19d990e85839', 'info', 'Negatív egyenleg', 'A(z) reccs pénztárcád egyenlege -5000 Ft.', '2025-10-31 18:53:51'),
('a398e618-d0cf-43c9-8c59-d582ced67ca1', '2afef064-52da-4a5e-90e6-01a21b5fef83', 'warning', 'Alacsony egyenleg', 'A(z) Fő pénztárcád egyenlege 500 Ft, ami 1000 Ft alatt van.', '2025-10-31 19:30:41'),
('ba5811cc-9645-48ff-810a-2606bfbd36e3', '1b50e492-6d0c-4229-a40e-19d990e85839', 'error', 'Negatív egyenleg', 'A(z) rev pénztárcád egyenlege -2000 Ft.', '2025-10-31 18:47:47'),
('d78e593f-6b09-4a7d-89ad-5ea1cce6e9bc', '1b50e492-6d0c-4229-a40e-19d990e85839', 'warning', 'Alacsony egyenleg', 'A(z) revolut pénztárcád egyenlege 50 Ft, ami 1000 Ft alatt van.', '2025-10-31 18:59:30');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `transactions`
--

CREATE TABLE `transactions` (
  `id` varchar(255) NOT NULL,
  `walletID` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `categoryID` varchar(255) NOT NULL,
  `type` varchar(7) NOT NULL,
  `isRecurring` tinyint(1) NOT NULL DEFAULT 0,
  `recurrenceFrequency` varchar(20) DEFAULT NULL,
  `nextRecurrenceDate` datetime DEFAULT NULL,
  `originalTransactionID` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `transactions`
--

INSERT INTO `transactions` (`id`, `walletID`, `amount`, `categoryID`, `type`, `isRecurring`, `recurrenceFrequency`, `nextRecurrenceDate`, `originalTransactionID`, `date`) VALUES
('0208bddd-7fef-4de1-b312-e0fbb38a4630', '54a24daf-bac5-442c-85a6-1ec93988aac2', 1000, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('0258966d-4d60-4cd0-b008-173ba80c44aa', 'bc004eda-1d32-4786-bb47-9e842f4e9fb3', 5000, 'd10ffdf0-f7d4-41c2-973e-5f519c38d523', 'bevétel', 1, 'daily', '2025-11-13 09:00:00', '6a425a80-1240-4179-815b-cd062240d49f', '2025-11-12 08:00:00'),
('028f9f95-3985-49c0-ad1b-c344121e3b1f', '4c0e39d5-1d4f-4222-b509-d5f703153604', 10000, 'f8399c2b-9730-4b85-9480-535ad266fc94', 'bevétel', 1, 'daily', '2025-11-13 09:00:00', 'c4725b33-e2eb-4c18-8aa4-d65bfbd2926d', '2025-11-12 08:00:00'),
('0475cb5a-6b69-48bf-88df-6f423d49fede', 'f676ba72-b481-4f8e-8993-c0b8f726e421', 1000, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('166a2cec-fadc-408b-b1ea-08614bfe530f', 'bc004eda-1d32-4786-bb47-9e842f4e9fb3', 10, '99e15537-1760-4d75-940a-7e9dff8b6ef3', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('22c39c1f-c29a-41ce-a6c6-6627bf76aa0d', 'bc004eda-1d32-4786-bb47-9e842f4e9fb3', 50, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('2afd39c3-c34d-42a0-a387-22dccb18435e', '3a81a83f-6abc-44b3-804e-e168a3f1dc9a', 1000, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('2e7b89f6-d989-4016-b1e3-3ba0692bcc79', '5816f5b1-7378-406a-a286-7d674d630c1c', 4999, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('3497f0ec-f91c-42ec-b2c4-2df6a975492a', 'ca166cc1-15ee-45ef-ad86-55a613d7c091', 100000, 'b8181ecb-4ced-4c8e-b728-ee52d02f0582', 'bevétel', 0, NULL, NULL, NULL, '2025-11-12 06:31:35'),
('3502e25b-5cb7-4418-8289-fb3c602b272f', 'c87ca957-f98c-43b1-91d2-c2072da667d1', 7000, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('4780e07e-6b33-4cf7-bebb-f3818742e7a0', '3aa02ef2-f9e7-4e58-b182-0e76ff34a977', 10, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('4f82b6e4-acdd-45b7-a9b7-09cce35f1135', '3a81a83f-6abc-44b3-804e-e168a3f1dc9a', 1000, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('53956a36-9b22-47c7-8994-4827c2593a45', 'bc004eda-1d32-4786-bb47-9e842f4e9fb3', 5000, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('59a855e1-491d-4e51-9483-b24c9250438d', '0b640f52-4900-49d3-93d8-a78873545253', 10000, '5d0e8ac0-431c-4108-a7bf-fcf445a98d98', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 06:11:12'),
('6463c10a-6853-4447-8d2a-258b869ed8a4', 'ca166cc1-15ee-45ef-ad86-55a613d7c091', 1000, '85b69aff-5bfc-4c74-bf76-a72c100dc98e', 'bevétel', 0, NULL, NULL, NULL, '2025-11-10 06:11:36'),
('6a425a80-1240-4179-815b-cd062240d49f', 'bc004eda-1d32-4786-bb47-9e842f4e9fb3', 5000, 'd10ffdf0-f7d4-41c2-973e-5f519c38d523', 'bevétel', 1, 'daily', '2025-11-13 09:00:00', NULL, '2025-11-05 07:09:14'),
('6e1cf9a8-5738-4c3a-bc87-6062a50fb3df', '734332a6-fd30-409e-b571-f56156818256', 500000, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('6fde6cdd-de2b-471a-a5fd-622f30621959', '734332a6-fd30-409e-b571-f56156818256', 500, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('7616d52e-7c1e-4784-9b7d-aed2c1caf50c', 'b47f2c44-523b-490a-ad8d-9ba387bea8f0', 3000, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('76be1b7c-ddd4-4194-a908-bfc755b1c8ce', '0b640f52-4900-49d3-93d8-a78873545253', 5500, 'f8399c2b-9730-4b85-9480-535ad266fc94', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 06:10:42'),
('77c16067-c883-4b88-98e8-ee4d6b75bc10', '5af326c8-9599-4d0a-906a-c9aab664df98', 500, 'd10ffdf0-f7d4-41c2-973e-5f519c38d523', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('79e898b7-1d1b-4964-a37c-a396c5e067f3', '4c0e39d5-1d4f-4222-b509-d5f703153604', 2000, '5d0e8ac0-431c-4108-a7bf-fcf445a98d98', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('827a3f75-c65b-40f7-8754-815fea0d6f98', '54a24daf-bac5-442c-85a6-1ec93988aac2', 98765, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('89ea13e2-1474-46da-8ea9-d67abb7d25a4', '96c8ab8c-7662-4129-8d4a-d4c56c1e499c', 500, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('9d6869d7-73e3-4883-badc-544d56d59c6e', 'ca166cc1-15ee-45ef-ad86-55a613d7c091', 5000, 'f8399c2b-9730-4b85-9480-535ad266fc94', 'kiadás', 0, NULL, NULL, NULL, '2025-11-10 06:11:47'),
('a5ec43f4-01bc-4342-8450-9d60cf5214a4', '294fbe6c-543f-43a3-9981-0815421d85b0', 5000, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('a65a6ba4-37f3-41e3-ba1e-3011e9c9ed02', '461e6fd3-9807-4ca2-b3f7-84f329184fdf', 1000, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('a97f7940-3e84-40cb-bd7b-99a1e06b467e', 'bc004eda-1d32-4786-bb47-9e842f4e9fb3', 5000, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('bb2a3251-9cdf-43b9-8852-7ad5e1e0a182', '461e6fd3-9807-4ca2-b3f7-84f329184fdf', 1000, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('bd0d2b62-08bb-4234-a46d-322ed35e9b62', '20b40fd2-d956-497a-943c-9c7bb1922f96', 10000, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('c0fc5c38-1767-4d72-9f4c-7a386c40980e', 'bc004eda-1d32-4786-bb47-9e842f4e9fb3', 1234567, 'd10ffdf0-f7d4-41c2-973e-5f519c38d523', 'bevétel', 1, 'monthly', '2025-12-01 18:35:45', NULL, '2025-11-05 07:09:14'),
('c2d93a17-dbed-4423-ad80-a68d49395339', 'ca166cc1-15ee-45ef-ad86-55a613d7c091', 67500, '5d0e8ac0-431c-4108-a7bf-fcf445a98d98', 'kiadás', 0, NULL, NULL, NULL, '2025-11-12 06:33:42'),
('c4725b33-e2eb-4c18-8aa4-d65bfbd2926d', '4c0e39d5-1d4f-4222-b509-d5f703153604', 10000, 'f8399c2b-9730-4b85-9480-535ad266fc94', 'bevétel', 1, 'daily', '2025-11-13 09:00:00', NULL, '2025-11-05 07:09:14'),
('cb6a7b8b-52da-493d-b1a3-1f89b3431991', '461e6fd3-9807-4ca2-b3f7-84f329184fdf', 1000, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('d99ff365-7158-40bf-93ed-e345f5b29e88', '5816f5b1-7378-406a-a286-7d674d630c1c', 1000, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('da9faf52-3dc3-4cf5-9ffa-7c093d1f3c9e', '4c0e39d5-1d4f-4222-b509-d5f703153604', 40000, '85b69aff-5bfc-4c74-bf76-a72c100dc98e', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('de948dc9-85de-4765-aaf4-01f973418268', '461e6fd3-9807-4ca2-b3f7-84f329184fdf', 1000, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('e47567a6-fe94-47b3-97f6-7b66ece33fa2', 'ca166cc1-15ee-45ef-ad86-55a613d7c091', 50000, 'b8181ecb-4ced-4c8e-b728-ee52d02f0582', 'bevétel', 0, NULL, NULL, NULL, '2025-11-12 06:32:51'),
('ead53dcc-3de0-49a7-b7b5-819a9530a2f9', '5af326c8-9599-4d0a-906a-c9aab664df98', 500, 'd10ffdf0-f7d4-41c2-973e-5f519c38d523', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('f3c2e8da-36db-4343-898b-e6226e5a9fe6', 'e3516a42-b63a-4f29-b999-bc4228ac4141', 500, 'custom_category_id1', 'kiadás', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('f76869be-127f-418b-a02e-638f9ff7d219', 'c79e9971-9a2c-4454-98d8-26ce512a3b8a', 500000, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14'),
('f966aaaf-747b-42c4-ba5f-ff9a475921ca', '3aa02ef2-f9e7-4e58-b182-0e76ff34a977', 1000, 'custom_category_id1', 'bevétel', 0, NULL, NULL, NULL, '2025-11-05 07:09:14');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(5) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`) VALUES
('075dbaf2-49cb-49ff-93f0-a421c3489f29', 'Janosne Ozvegy Maria', 'gasdgadsgasglksmdgbasdk@gmail.com', '$2b$10$cyVRiWll5BlMmd2t562gi.Uvk.Mmtxe7fs8GDc2RS1iu0kcXjRah2', 'user', 1),
('141c2159-1dc2-4d01-8184-46e569c7dae8', 'jeno', 'jeno@jeno.hu', '$2b$10$CXGBhfzb69mTTt649zQY9eopKGc37kI77ZRKOWyHr9JLKG4jDfHqe', 'user', 1),
('1b50e492-6d0c-4229-a40e-19d990e85839', 'Jani', 'takeyoutohell@gmail.com', '$2b$10$fbd2r01ZaAmzHW9Gp9TuSeCCUFMCA/SKsxDLN4MvknbDv8MmpAmFC', 'user', 1),
('27378235-febb-4d27-8bbd-312153df6237', 'Teszt', 'tesztes@teszt.hu', '$2b$10$7xjfgUnkhODyLIHibhJwyOS8hf61gljxgFjuc.DjMDX05K/oRXhQm', 'user', 1),
('2afef064-52da-4a5e-90e6-01a21b5fef83', 'Janibani', 'elottenemvotjo@gmail.com', '$2b$10$8oM283ikZbLOvcKJwngAEum.SfULnW6XxmPLF6sd7aZA10YwD4jLu', 'user', 1),
('37230f68-0d3e-4546-9641-7f3774fcb317', 'Wizard', 'onceiproofed@gmail.com', '$2b$10$eZXxiWyMjg/T/a6BbCdJl.s.0mqsykzLI2ZogZ6YESUzojxur8/j.', 'user', 1),
('3f2813b2-8771-4e3a-b065-4c8480119be2', 'tappancs janos', 'tapijancsi@gmail.com', '$2b$10$0IxFBFGtzlXzE8okDSbxiu5sck1ADafS6QekUoFlBTkuERvqCmN06', 'user', 1),
('47d285b7-287e-4f0d-9e14-1bd2188f4f78', 'Jani', 'atlet@gmail.com', '$2b$10$UzJ3pyIIFqKxiE114xqYj.iZRR8cMXIYiK00u3mPz0hzVH4V9Ez0y', 'user', 1),
('676beeba-0bb3-49f9-b8c8-dd2ed539fb78', 'Asd', 'asdasd@asd.hu', '$2b$10$.rErk10ThnsGD6JU/jxwzepgETqHOTnPGI/lVG6nViJprvDuqvG3S', 'user', 1),
('7a0b70e1-0062-4823-b436-00102367aded', 'PullMeDown', 'kissmegoodbie@gmail.com', '$2b$10$aErfNRb8oThMiGQNkg9gz.80edQU/KogGkqv1ynPirAxyKQfAnlh6', 'user', 1),
('80f9170f-abe7-4a11-a7d0-eb99704e4a95', 'Helyes Erzsi', 'helyeserzsi@gmail.com', '$2b$10$RFBoaT7OdkQ4/2IYulDPDeDOCHd/ZcsDezlVY1IN72YCveXL0z4NC', 'user', 1),
('99a6e572-9227-482d-b235-654342e4f35f', 'Jani', 'oneless@gmail.com', '$2b$10$GrFv40iEadf81H7GhEhHxuHiOsoHi8keMMw41NGrdQyueD2Eq3JHu', 'user', 1),
('ac95a2f5-d74d-4ede-9134-f0cabafca11d', 'Dóczi Erika', 'csipicsupirubiraba@gmail.hu', '$2b$10$9a/kmdzs5wZFVxZXDXd9me/RhRTli8EPDEjsxJtnv804KF2OW5YkS', 'user', 1),
('bc2cb785-77d8-4256-945c-160d614685e2', 'Bootstrap', 'abootstrapegyszar@gmail.com', '$2b$10$wziESqC6jh/P0Ieo5zISwujLD9fY/zYisdbdVxtbcTV75B/8C.yaO', 'user', 1),
('bdd4b115-fc3e-4b85-8784-87f354f51e57', 'Janoska', 'takacs.janos@turr.hu', '$2b$10$4tuVaPlgSymE1sDOVjE02Otm9U1t7IlJijhv7ail6gm9MuuuLtEK.', 'user', 1),
('c79f5f43-4887-42a3-9ee3-969089fae4f6', 'csipicsup2irubiraba', 'csipicsup2irubiraba@gmail.hu', '$2b$10$/tqhWpEHSyCAHK/pW7UUeeY2TBIkeInj9bw84liDLCBsVnl51cz9y', 'user', 1),
('caa9fb19-750d-4a02-a2e2-2935dfe539f8', 'Karika Jancsi', 'karikajancsi@gmail.com', '$2b$10$pBmGRhRTX2f1q2SmoljQS.iserZ8zy1lHobgb7wqiTOYryLMyx12G', 'user', 1),
('e0b2e58e-861b-409e-a99d-f3c4bad9c004', 'rsgsrg', 'sagg@gmail.com', '$2b$10$NsRxb1j8bGNYiR3ifqbxh.AK1LziAsUeXpnHuAjyICocAlAp1HKq6', 'user', 1),
('e1ecb32a-87eb-45c1-b251-e329af0c2812', 'Gyozo123', 'gyozike@gmail.com', '$2b$10$SET57FHl20JwFodgJ6Gk8uDWaaFNIhtfXSWXDD9xt8lE.nRrfXgTO', 'user', 1),
('e4b98721-ec03-46cf-ba27-25eb92d3669c', 'asfasfasfasfaf', 'kutyamacska23@gmail.com', '$2b$10$dxgofNKffFdd08vZUjA8Fe3MS1RN/xOFFYyX3WaLgVKdMXOkQu3ZS', 'user', 1),
('e6b7503b-27b4-4ad2-8326-f7337156411f', 'asfasfasfasfaf', 'kutyamacska2@gmail.com', '$2b$10$F.fcvKJcTTLR4SuqbGMbrOa1smcvXwUDYsf5gesXixlaPtq7eTJwu', 'user', 1),
('f6176d4e-e0cf-4673-ac39-bf778db12717', 'kutyamacska123', 'kutyamacska@gmail.com', '$2b$10$y.ibWQ1bjwkNioobg7ouuuUISDuM89gRNgPj5DdBlTw6HaxcjutIm', 'user', 1),
('f66776c1-0fc7-4d62-bae3-ec717e1437d1', 'Jani', 'gasdgadsgasglksmdgb2asdk@gmail.com', '$2b$10$yybLAfgPSNEFW5uvK5UR2umXKbQu0pJjobtvcWnzDEobt.EQlKuGu', 'user', 1),
('fddf47d4-b404-45c7-a30f-61a9a5a0eb0e', 'Teszt Elek', 'tesztelek@teszt.hu', '$2b$10$tGHz45VFcnYN/Wq5tELF8uhiy6FOSFYBGrBmUSQHeiKo4588LeVoC', 'user', 1),
('ffd5c2eb-8d80-4526-a13f-469eed895808', 'asfasfas', 'asfsafa@gmail.com', '$2b$10$7fRoeWU8cMJz/Rie2c7g6.uBoCJFrCluiiQmIHNpLamWG8iV/xXEe', 'user', 1),
('u001', 'Kiss Péter', 'peter.kiss@example.com', 'hashed_pw_123', 'user', 1),
('u002', 'Nagy Anna', 'anna.nagy@example.com', 'hashed_pw_456', 'user', 1),
('u003', 'Tóth Gábor', 'gabor.toth@example.com', 'hashed_pw_789', 'admin', 1),
('u004', 'Szabó Márta', 'marta.szabo@example.com', 'hashed_pw_abc', 'user', 0),
('u005', 'Farkas László', 'laszlo.farkas@example.com', 'hashed_pw_xyz', 'mod', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_notification_preferences`
--

CREATE TABLE `user_notification_preferences` (
  `id` varchar(255) NOT NULL,
  `userID` varchar(255) NOT NULL,
  `lowBalanceThreshold` int(11) DEFAULT 1000,
  `negativeBalanceEnabled` tinyint(1) DEFAULT 1,
  `highBalanceThreshold` int(11) DEFAULT 10000000,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `user_notification_preferences`
--

INSERT INTO `user_notification_preferences` (`id`, `userID`, `lowBalanceThreshold`, `negativeBalanceEnabled`, `highBalanceThreshold`, `createdAt`, `updatedAt`) VALUES
('5e3a4e8a-64b0-4aa8-ad4c-8ba5775762b7', 'fddf47d4-b404-45c7-a30f-61a9a5a0eb0e', 1000, 1, 10000000, '2025-11-10 08:11:36', '2025-11-10 08:11:36'),
('70c54772-20e4-47b1-82bd-40dc735f8d57', '2d23c0a0-29eb-46ed-9a41-b273d88ccdfe', 1000, 1, 10000000, '2025-11-04 08:14:03', '2025-11-04 08:14:03'),
('b19b74af-d63a-43c8-a4bd-f11c0857c520', 'bdd4b115-fc3e-4b85-8784-87f354f51e57', 1000, 1, 10000000, '2025-11-05 08:09:51', '2025-11-05 08:09:51'),
('beae29fe-1421-450e-8ae4-4143e0e671b1', '2afef064-52da-4a5e-90e6-01a21b5fef83', 1000, 1, 10000000, '2025-10-31 19:30:41', '2025-10-31 19:30:41'),
('d9301957-70ff-48c4-928a-fd4eb2fb1129', '1b50e492-6d0c-4229-a40e-19d990e85839', 1000, 1, 10000000, '2025-10-31 19:29:03', '2025-10-31 19:29:03');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `wallets`
--

CREATE TABLE `wallets` (
  `id` varchar(255) NOT NULL,
  `userID` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `balance` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `wallets`
--

INSERT INTO `wallets` (`id`, `userID`, `name`, `balance`) VALUES
('0b640f52-4900-49d3-93d8-a78873545253', 'bdd4b115-fc3e-4b85-8784-87f354f51e57', 'KP', 104500),
('294fbe6c-543f-43a3-9981-0815421d85b0', '47d285b7-287e-4f0d-9e14-1bd2188f4f78', 'LaLaLallala2', 4000),
('3a81a83f-6abc-44b3-804e-e168a3f1dc9a', '37230f68-0d3e-4546-9641-7f3774fcb317', 'WizardandI', 1000),
('3aa02ef2-f9e7-4e58-b182-0e76ff34a977', '7a0b70e1-0062-4823-b436-00102367aded', 'Glinda', 50),
('4c0e39d5-1d4f-4222-b509-d5f703153604', '2d23c0a0-29eb-46ed-9a41-b273d88ccdfe', 'Bankkártya', 158000),
('54a24daf-bac5-442c-85a6-1ec93988aac2', '80f9170f-abe7-4a11-a7d0-eb99704e4a95', 'Rev', 5000),
('5af326c8-9599-4d0a-906a-c9aab664df98', '2afef064-52da-4a5e-90e6-01a21b5fef83', 'Fő', 1519),
('6e2fc1a3-5970-4509-8ba3-b59df141b6b9', '141c2159-1dc2-4d01-8184-46e569c7dae8', 'Rivolut', 1000),
('bc004eda-1d32-4786-bb47-9e842f4e9fb3', '1b50e492-6d0c-4229-a40e-19d990e85839', 'revolut', 1339557),
('c79e9971-9a2c-4454-98d8-26ce512a3b8a', 'e0b2e58e-861b-409e-a99d-f3c4bad9c004', 'Mastercard', 5000),
('ca166cc1-15ee-45ef-ad86-55a613d7c091', 'fddf47d4-b404-45c7-a30f-61a9a5a0eb0e', 'Bankkártya', 178500),
('f1482b36-481a-4168-b50c-8f74d2eb9709', '47d285b7-287e-4f0d-9e14-1bd2188f4f78', 'Revolut', 500),
('f676ba72-b481-4f8e-8993-c0b8f726e421', '99a6e572-9227-482d-b235-654342e4f35f', 'szia anya', -999);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`);

--
-- A tábla indexei `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `user_notification_preferences`
--
ALTER TABLE `user_notification_preferences`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userID` (`userID`);

--
-- A tábla indexei `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
