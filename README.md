# Cryptochain

A blockchain cryptocurrency implementation project (https://gale.udemy.com/course/build-blockchain-full-stack/).

## Prerequisites

- Node.js (v16.15.1 or higher recommended)
- npm (v8.11.0 or higher recommended)

## Steps

- `npm init -y`
- `npm i jest@23.6.0 --save-dev`
- `npm install --save-dev nodemon`

## Notes

### Object Parameter Destructuring

**({ timestamp, lastHash, hash, data })**

- Parameter passing: Requires an object with named properties
- Order independence: The order of properties doesn't matter
- Named parameters: Makes function calls more readable
- Default values: Easily supports default values for parameters

  ```javascript
  const block2 = new Block({}); // this would be all undefined
  ```

- Partial parameters: Can omit some parameters when calling
