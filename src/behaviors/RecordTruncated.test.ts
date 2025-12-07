import { Late } from "silentium";
import { describe, expect, test, vi } from "vitest";

import { RecordTruncated } from "./RecordTruncated";

describe("RecordTruncated", () => {
  test("Basic truncation with simple bad values", () => {
    const $record = Late({
      name: "John",
      age: 30,
      status: "active",
      role: "user",
    });
    const $badValues = Late(["active", "user"]);
    const result = RecordTruncated($record, $badValues);

    const g = vi.fn();
    result.then(g);

    expect(g).toHaveBeenLastCalledWith({
      name: "John",
      age: 30,
    });
  });

  test("Nested object truncation", () => {
    const $record = Late({
      user: {
        name: "John",
        status: "active",
        details: {
          role: "admin",
          level: "high",
        },
      },
      settings: {
        theme: "dark",
        notifications: "enabled",
      },
    });
    const $badValues = Late(["active", "enabled"]);
    const result = RecordTruncated($record, $badValues);

    const g = vi.fn();
    result.then(g);

    expect(g).toHaveBeenLastCalledWith({
      user: {
        name: "John",
        details: {
          role: "admin",
          level: "high",
        },
      },
      settings: {
        theme: "dark",
      },
    });
  });

  test("Empty objects are removed", () => {
    const $record = Late({
      user: {
        status: "active",
      },
      settings: {
        theme: "dark",
      },
    });
    const $badValues = Late(["active"]);
    const result = RecordTruncated($record, $badValues);

    const g = vi.fn();
    result.then(g);

    expect(g).toHaveBeenLastCalledWith({
      settings: {
        theme: "dark",
      },
    });
  });

  test("Arrays are preserved as-is", () => {
    const $record = Late({
      items: ["apple", "banana", "cherry"],
      config: {
        enabled: true,
      },
    });
    const $badValues = Late(["banana", true]);
    const result = RecordTruncated($record, $badValues);

    const g = vi.fn();
    result.then(g);

    expect(g).toHaveBeenLastCalledWith({
      items: ["apple", "banana", "cherry"],
    });
  });

  test("Null values are preserved", () => {
    const $record = Late({
      name: "John",
      middleName: null,
      status: "active",
    });
    const $badValues = Late(["active"]);
    const result = RecordTruncated($record, $badValues);

    const g = vi.fn();
    result.then(g);

    expect(g).toHaveBeenLastCalledWith({
      name: "John",
      middleName: null,
    });
  });

  test("Reacts to record changes", () => {
    const $record = Late({
      name: "John",
      status: "active",
    });
    const $badValues = Late(["active"]);
    const result = RecordTruncated($record, $badValues);

    const g = vi.fn();
    result.then(g);

    expect(g).toHaveBeenLastCalledWith({
      name: "John",
    });

    $record.use({
      name: "Jane",
      status: "inactive",
    });

    expect(g).toHaveBeenLastCalledWith({
      name: "Jane",
      status: "inactive",
    });
  });

  test("Reacts to bad values changes", () => {
    const $record = Late({
      name: "John",
      status: "active",
      role: "user",
    });
    const $badValues = Late(["active"]);
    const result = RecordTruncated($record, $badValues);

    const g = vi.fn();
    result.then(g);

    expect(g).toHaveBeenLastCalledWith({
      name: "John",
      role: "user",
    });

    $badValues.use(["active", "user"]);

    expect(g).toHaveBeenLastCalledWith({
      name: "John",
    });
  });

  test("Complex nested structure", () => {
    const $record = Late({
      user: {
        profile: {
          name: "John",
          status: "active",
          details: {
            role: "admin",
            permissions: {
              read: true,
              write: "allowed",
              delete: "denied",
            },
          },
        },
        settings: {
          theme: "dark",
          notifications: "enabled",
          language: "en",
        },
      },
      metadata: {
        created: "2023-01-01",
        modified: "2023-01-02",
        version: "1.0",
      },
    });

    const $badValues = Late(["active", "enabled", "denied", "1.0"]);
    const result = RecordTruncated($record, $badValues);

    const g = vi.fn();
    result.then(g);

    expect(g).toHaveBeenLastCalledWith({
      user: {
        profile: {
          name: "John",
          details: {
            role: "admin",
            permissions: {
              read: true,
              write: "allowed",
            },
          },
        },
        settings: {
          theme: "dark",
          language: "en",
        },
      },
      metadata: {
        created: "2023-01-01",
        modified: "2023-01-02",
      },
    });
  });

  test("Empty bad values array", () => {
    const $record = Late({
      name: "John",
      status: "active",
    });
    const $badValues = Late([]);
    const result = RecordTruncated($record, $badValues);

    const g = vi.fn();
    result.then(g);

    expect(g).toHaveBeenLastCalledWith({
      name: "John",
      status: "active",
    });
  });

  test("All values are bad", () => {
    const $record = Late({
      status: "active",
      role: "user",
    });
    const $badValues = Late(["active", "user"]);
    const result = RecordTruncated($record, $badValues);

    const g = vi.fn();
    result.then(g);

    expect(g).toHaveBeenLastCalledWith({});
  });
});
