// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("NextSquareCoordi")));
bytes32 constant NextSquareCoordinatesTableId = _tableId;

struct NextSquareCoordinatesData {
  uint32[] nextX;
  uint32[] nextY;
}

library NextSquareCoordinates {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](2);
    _schema[0] = SchemaType.UINT32_ARRAY;
    _schema[1] = SchemaType.UINT32_ARRAY;

    return SchemaLib.encode(_schema);
  }

  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](3);
    _schema[0] = SchemaType.UINT32;
    _schema[1] = SchemaType.UINT32;
    _schema[2] = SchemaType.UINT32;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's metadata */
  function getMetadata() internal pure returns (string memory, string[] memory) {
    string[] memory _fieldNames = new string[](2);
    _fieldNames[0] = "nextX";
    _fieldNames[1] = "nextY";
    return ("NextSquareCoordinates", _fieldNames);
  }

  /** Register the table's schema */
  function registerSchema() internal {
    StoreSwitch.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Register the table's schema (using the specified store) */
  function registerSchema(IStore _store) internal {
    _store.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Set the table's metadata */
  function setMetadata() internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    StoreSwitch.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Set the table's metadata (using the specified store) */
  function setMetadata(IStore _store) internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    _store.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Get nextX */
  function getNextX(uint32 mapId, uint32 prevX, uint32 prevY) internal view returns (uint32[] memory nextX) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_uint32());
  }

  /** Get nextX (using the specified store) */
  function getNextX(
    IStore _store,
    uint32 mapId,
    uint32 prevX,
    uint32 prevY
  ) internal view returns (uint32[] memory nextX) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_uint32());
  }

  /** Set nextX */
  function setNextX(uint32 mapId, uint32 prevX, uint32 prevY, uint32[] memory nextX) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    StoreSwitch.setField(_tableId, _keyTuple, 0, EncodeArray.encode((nextX)));
  }

  /** Set nextX (using the specified store) */
  function setNextX(IStore _store, uint32 mapId, uint32 prevX, uint32 prevY, uint32[] memory nextX) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    _store.setField(_tableId, _keyTuple, 0, EncodeArray.encode((nextX)));
  }

  /** Get the length of nextX */
  function lengthNextX(uint32 mapId, uint32 prevX, uint32 prevY) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    uint256 _byteLength = StoreSwitch.getFieldLength(_tableId, _keyTuple, 0, getSchema());
    return _byteLength / 4;
  }

  /** Get the length of nextX (using the specified store) */
  function lengthNextX(IStore _store, uint32 mapId, uint32 prevX, uint32 prevY) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    uint256 _byteLength = _store.getFieldLength(_tableId, _keyTuple, 0, getSchema());
    return _byteLength / 4;
  }

  /** Get an item of nextX (unchecked, returns invalid data if index overflows) */
  function getItemNextX(uint32 mapId, uint32 prevX, uint32 prevY, uint256 _index) internal view returns (uint32) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    bytes memory _blob = StoreSwitch.getFieldSlice(_tableId, _keyTuple, 0, getSchema(), _index * 4, (_index + 1) * 4);
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Get an item of nextX (using the specified store) (unchecked, returns invalid data if index overflows) */
  function getItemNextX(
    IStore _store,
    uint32 mapId,
    uint32 prevX,
    uint32 prevY,
    uint256 _index
  ) internal view returns (uint32) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    bytes memory _blob = _store.getFieldSlice(_tableId, _keyTuple, 0, getSchema(), _index * 4, (_index + 1) * 4);
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Push an element to nextX */
  function pushNextX(uint32 mapId, uint32 prevX, uint32 prevY, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    StoreSwitch.pushToField(_tableId, _keyTuple, 0, abi.encodePacked((_element)));
  }

  /** Push an element to nextX (using the specified store) */
  function pushNextX(IStore _store, uint32 mapId, uint32 prevX, uint32 prevY, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    _store.pushToField(_tableId, _keyTuple, 0, abi.encodePacked((_element)));
  }

  /** Pop an element from nextX */
  function popNextX(uint32 mapId, uint32 prevX, uint32 prevY) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    StoreSwitch.popFromField(_tableId, _keyTuple, 0, 4);
  }

  /** Pop an element from nextX (using the specified store) */
  function popNextX(IStore _store, uint32 mapId, uint32 prevX, uint32 prevY) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    _store.popFromField(_tableId, _keyTuple, 0, 4);
  }

  /** Update an element of nextX at `_index` */
  function updateNextX(uint32 mapId, uint32 prevX, uint32 prevY, uint256 _index, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    StoreSwitch.updateInField(_tableId, _keyTuple, 0, _index * 4, abi.encodePacked((_element)));
  }

  /** Update an element of nextX (using the specified store) at `_index` */
  function updateNextX(
    IStore _store,
    uint32 mapId,
    uint32 prevX,
    uint32 prevY,
    uint256 _index,
    uint32 _element
  ) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    _store.updateInField(_tableId, _keyTuple, 0, _index * 4, abi.encodePacked((_element)));
  }

  /** Get nextY */
  function getNextY(uint32 mapId, uint32 prevX, uint32 prevY) internal view returns (uint32[] memory nextY) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_uint32());
  }

  /** Get nextY (using the specified store) */
  function getNextY(
    IStore _store,
    uint32 mapId,
    uint32 prevX,
    uint32 prevY
  ) internal view returns (uint32[] memory nextY) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_uint32());
  }

  /** Set nextY */
  function setNextY(uint32 mapId, uint32 prevX, uint32 prevY, uint32[] memory nextY) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    StoreSwitch.setField(_tableId, _keyTuple, 1, EncodeArray.encode((nextY)));
  }

  /** Set nextY (using the specified store) */
  function setNextY(IStore _store, uint32 mapId, uint32 prevX, uint32 prevY, uint32[] memory nextY) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    _store.setField(_tableId, _keyTuple, 1, EncodeArray.encode((nextY)));
  }

  /** Get the length of nextY */
  function lengthNextY(uint32 mapId, uint32 prevX, uint32 prevY) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    uint256 _byteLength = StoreSwitch.getFieldLength(_tableId, _keyTuple, 1, getSchema());
    return _byteLength / 4;
  }

  /** Get the length of nextY (using the specified store) */
  function lengthNextY(IStore _store, uint32 mapId, uint32 prevX, uint32 prevY) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    uint256 _byteLength = _store.getFieldLength(_tableId, _keyTuple, 1, getSchema());
    return _byteLength / 4;
  }

  /** Get an item of nextY (unchecked, returns invalid data if index overflows) */
  function getItemNextY(uint32 mapId, uint32 prevX, uint32 prevY, uint256 _index) internal view returns (uint32) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    bytes memory _blob = StoreSwitch.getFieldSlice(_tableId, _keyTuple, 1, getSchema(), _index * 4, (_index + 1) * 4);
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Get an item of nextY (using the specified store) (unchecked, returns invalid data if index overflows) */
  function getItemNextY(
    IStore _store,
    uint32 mapId,
    uint32 prevX,
    uint32 prevY,
    uint256 _index
  ) internal view returns (uint32) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    bytes memory _blob = _store.getFieldSlice(_tableId, _keyTuple, 1, getSchema(), _index * 4, (_index + 1) * 4);
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Push an element to nextY */
  function pushNextY(uint32 mapId, uint32 prevX, uint32 prevY, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    StoreSwitch.pushToField(_tableId, _keyTuple, 1, abi.encodePacked((_element)));
  }

  /** Push an element to nextY (using the specified store) */
  function pushNextY(IStore _store, uint32 mapId, uint32 prevX, uint32 prevY, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    _store.pushToField(_tableId, _keyTuple, 1, abi.encodePacked((_element)));
  }

  /** Pop an element from nextY */
  function popNextY(uint32 mapId, uint32 prevX, uint32 prevY) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    StoreSwitch.popFromField(_tableId, _keyTuple, 1, 4);
  }

  /** Pop an element from nextY (using the specified store) */
  function popNextY(IStore _store, uint32 mapId, uint32 prevX, uint32 prevY) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    _store.popFromField(_tableId, _keyTuple, 1, 4);
  }

  /** Update an element of nextY at `_index` */
  function updateNextY(uint32 mapId, uint32 prevX, uint32 prevY, uint256 _index, uint32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    StoreSwitch.updateInField(_tableId, _keyTuple, 1, _index * 4, abi.encodePacked((_element)));
  }

  /** Update an element of nextY (using the specified store) at `_index` */
  function updateNextY(
    IStore _store,
    uint32 mapId,
    uint32 prevX,
    uint32 prevY,
    uint256 _index,
    uint32 _element
  ) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    _store.updateInField(_tableId, _keyTuple, 1, _index * 4, abi.encodePacked((_element)));
  }

  /** Get the full data */
  function get(
    uint32 mapId,
    uint32 prevX,
    uint32 prevY
  ) internal view returns (NextSquareCoordinatesData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(
    IStore _store,
    uint32 mapId,
    uint32 prevX,
    uint32 prevY
  ) internal view returns (NextSquareCoordinatesData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(uint32 mapId, uint32 prevX, uint32 prevY, uint32[] memory nextX, uint32[] memory nextY) internal {
    bytes memory _data = encode(nextX, nextY);

    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    StoreSwitch.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using individual values (using the specified store) */
  function set(
    IStore _store,
    uint32 mapId,
    uint32 prevX,
    uint32 prevY,
    uint32[] memory nextX,
    uint32[] memory nextY
  ) internal {
    bytes memory _data = encode(nextX, nextY);

    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    _store.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using the data struct */
  function set(uint32 mapId, uint32 prevX, uint32 prevY, NextSquareCoordinatesData memory _table) internal {
    set(mapId, prevX, prevY, _table.nextX, _table.nextY);
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(
    IStore _store,
    uint32 mapId,
    uint32 prevX,
    uint32 prevY,
    NextSquareCoordinatesData memory _table
  ) internal {
    set(_store, mapId, prevX, prevY, _table.nextX, _table.nextY);
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal pure returns (NextSquareCoordinatesData memory _table) {
    // 0 is the total byte length of static data
    PackedCounter _encodedLengths = PackedCounter.wrap(Bytes.slice32(_blob, 0));

    // Store trims the blob if dynamic fields are all empty
    if (_blob.length > 0) {
      uint256 _start;
      // skip static data length + dynamic lengths word
      uint256 _end = 32;

      _start = _end;
      _end += _encodedLengths.atIndex(0);
      _table.nextX = (SliceLib.getSubslice(_blob, _start, _end).decodeArray_uint32());

      _start = _end;
      _end += _encodedLengths.atIndex(1);
      _table.nextY = (SliceLib.getSubslice(_blob, _start, _end).decodeArray_uint32());
    }
  }

  /** Tightly pack full data using this table's schema */
  function encode(uint32[] memory nextX, uint32[] memory nextY) internal pure returns (bytes memory) {
    uint40[] memory _counters = new uint40[](2);
    _counters[0] = uint40(nextX.length * 4);
    _counters[1] = uint40(nextY.length * 4);
    PackedCounter _encodedLengths = PackedCounterLib.pack(_counters);

    return abi.encodePacked(_encodedLengths.unwrap(), EncodeArray.encode((nextX)), EncodeArray.encode((nextY)));
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(uint32 mapId, uint32 prevX, uint32 prevY) internal pure returns (bytes32[] memory _keyTuple) {
    _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));
  }

  /* Delete all data for given keys */
  function deleteRecord(uint32 mapId, uint32 prevX, uint32 prevY) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, uint32 mapId, uint32 prevX, uint32 prevY) internal {
    bytes32[] memory _keyTuple = new bytes32[](3);
    _keyTuple[0] = bytes32(uint256(mapId));
    _keyTuple[1] = bytes32(uint256(prevX));
    _keyTuple[2] = bytes32(uint256(prevY));

    _store.deleteRecord(_tableId, _keyTuple);
  }
}
