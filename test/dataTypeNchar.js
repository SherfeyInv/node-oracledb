/* Copyright (c) 2015, 2023, Oracle and/or its affiliates. */

/******************************************************************************
 *
 * This software is dual-licensed to you under the Universal Permissive License
 * (UPL) 1.0 as shown at https://oss.oracle.com/licenses/upl and Apache License
 * 2.0 as shown at https://www.apache.org/licenses/LICENSE-2.0. You may choose
 * either license.
 *
 * If you elect to accept the software under the Apache License, Version 2.0,
 * the following applies:
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   23. dataTypeNchar.js
 *
 * DESCRIPTION
 *   Testing Oracle data type support - NCHAR.
 *
 *****************************************************************************/
'use strict';

const oracledb = require('oracledb');
const assist   = require('./dataTypeAssist.js');
const dbConfig = require('./dbconfig.js');

describe('23. dataTypeNchar.js', function() {

  let connection = null;
  let tableName = "nodb_nchar";

  let strLen = [10, 100, 500, 1000];
  let strs = [];
  for (let i = 0; i < strLen.length; i++)
    strs[i] = assist.createCharString(strLen[i]);

  before('get one connection', async function() {
    connection = await oracledb.getConnection(dbConfig);
  });

  after('release connection', async function() {
    await connection.close();
  });

  describe('23.1 testing NCHAR data in various lengths', function() {

    before('create table, insert data', async function() {
      await assist.setUp(connection, tableName, strs);
    });

    after(async function() {
      await connection.execute(`DROP table ` + tableName + ` PURGE`);
    });

    it('23.1.1 SELECT query', async function() {
      await assist.dataTypeSupport(connection, tableName, strs);
    });

    it('23.1.2 resultSet stores NCHAR data correctly', async function() {
      await assist.verifyResultSet(connection, tableName, strs);
    });

    it('23.1.3 works well with REF Cursor', async function() {
      await assist.verifyRefCursor(connection, tableName, strs);
    });

    it('23.1.4 columns fetched from REF CURSORS can be mapped by fetchInfo settings', async function() {
      await assist.verifyRefCursorWithFetchInfo(connection, tableName, strs);
    });
  });

  describe('23.2 stores null value correctly', function() {
    it('23.2.1 testing Null, Empty string and Undefined', async function() {
      await assist.verifyNullValues(connection, tableName);
    });
  });

});
