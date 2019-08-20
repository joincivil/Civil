import { BN } from "bn.js";

/* tslint:disable:only-arrow-functions */
/* tslint:disable:no-invalid-this */
/* tslint:disable:variable-name */

export default function(): (chai: any, utils: any) => void {
  return (chai: any, utils: any): void => {
    chai.Assertion.addProperty("bignumber", function(): void {
      utils.flag(this, "bignumber", true);
    });

    const convert = function(value: any, dp: any, rm: any): BN {
      if (typeof value === "string" || typeof value === "number") {
        return new BN(value);
      } else {
        return value as BN;
      }
    };

    const overwriteMethods = function(names: string[], fn: (expected: BN, actual: BN) => void): void {
      function overwriteMethod(original: any): any {
        return function(value: any, dp: any, rm: any): void {
          if (utils.flag(this, "bignumber")) {
            const expected = convert(value, dp, rm);
            const actual = convert(this._obj, dp, rm);
            fn.apply(this, [expected, actual]);
          } else {
            original.apply(this, arguments);
          }
        };
      }
      for (const name of names) {
        chai.Assertion.overwriteMethod(name, overwriteMethod);
      }
    };

    // BN.isEqualTo
    overwriteMethods(["equal", "equals", "eq"], function(expected: BN, actual: BN): void {
      this.assert(
        expected.eq(actual),
        "expected #{act} to equal #{exp}",
        "expected #{act} to be different from #{exp}",
        expected.toString(),
        actual.toString(),
      );
    });

    // BN.isGreaterThan
    overwriteMethods(["above", "gt", "greaterThan"], function(expected: BN, actual: BN): void {
      this.assert(
        actual.gt(expected),
        "expected #{act} to be greater than #{exp}",
        "expected #{act} to be less than or equal to #{exp}",
        expected.toString(),
        actual.toString(),
      );
    });

    // BN.isGreaterThanOrEqualTo
    overwriteMethods(["least", "gte"], function(expected: BN, actual: BN): void {
      this.assert(
        actual.gte(expected),
        "expected #{act} to be greater than or equal to #{exp}",
        "expected #{act} to be less than #{exp}",
        expected.toString(),
        actual.toString(),
      );
    });

    // BN.isLessThan
    overwriteMethods(["below", "lt", "lessThan"], function(expected: BN, actual: BN): void {
      this.assert(
        actual.lt(expected),
        "expected #{act} to be less than #{exp}",
        "expected #{act} to be greater than or equal to #{exp}",
        expected.toString(),
        actual.toString(),
      );
    });

    // BN.isLessThanOrEqualTo
    overwriteMethods(["most", "lte"], function(expected: BN, actual: BN): void {
      this.assert(
        expected.lte(actual),
        "expected #{act} to be less than or equal to #{exp}",
        "expected #{act} to be greater than #{exp}",
        expected.toString(),
        actual.toString(),
      );
    });
  };
}
