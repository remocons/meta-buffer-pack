# 메타 버퍼 팩 (MBP)

[English](README.md) | [한국어](README.ko.md)

Meta Buffer Pack은 바이너리 데이터에 각 필드의 이름, 타입, 오프셋, 길이를 설명하는 메타데이터를 결합하는 JavaScript 라이브러리입니다. 패킹된 버퍼를 객체로 복원하거나 원시 바이트와 메타데이터를 분리할 수 있습니다.

바이너리 payload와 속성을 묶거나, 애플리케이션 메시지를 교환하거나, 정수 크기와 바이트 순서를 명시하는 간단한 바이너리 레이아웃을 만들 때 사용할 수 있습니다. MBP는 직렬화 도구를 제공하며 전송, 메시지 프레이밍, 압축, 암호화는 별도로 구현해야 합니다.

## 설치와 실행 환경

```sh
npm install meta-buffer-pack
```

Node.js용 ESM/CommonJS와 브라우저용 UMD/ESM 빌드를 제공합니다. 브라우저 빌드에는 Node.js 호환 Buffer 구현이 포함되어 있으며 `MBP.Buffer`로 접근합니다. 실행 환경에 `TextEncoder`와 `TextDecoder`가 필요합니다.

## 빠른 시작

```js
import MBP from 'meta-buffer-pack';

const packet = MBP.pack(
  MBP.MB('id', '16L', 7),
  MBP.MB('message', 'hello'),
  MBP.MB('payload', MBP.Buffer.from([1, 2, 3])),
  MBP.MB('optional', null)
);

const result = MBP.unpack(packet);
if (result === undefined) throw new Error('Invalid packet');

console.log(result.id);                  // 7
console.log(result.message);             // 'hello'
console.log([...result.payload]);        // [1, 2, 3]
console.log(result.optional);            // null
console.log(MBP.Buffer.isBuffer(result.payload)); // true
```

### CommonJS

`example.cjs`와 같은 CommonJS 파일에서 다음과 같이 불러옵니다.

```js
const MBP = require('meta-buffer-pack');
const packet = MBP.pack(MBP.MB('message', 'hello'));
console.log(MBP.unpack(packet).message); // 'hello'
```

### 브라우저: UMD

`dist/meta-buffer-pack.min.js`를 사이트에 복사하고 경로를 맞춥니다.

```html
<script src="./dist/meta-buffer-pack.min.js"></script>
<script>
  const packet = MBP.pack(MBP.MB('payload', MBP.Buffer.from([1, 2, 3])));
  console.log([...MBP.unpack(packet).payload]); // [1, 2, 3]
</script>
```

UMD 빌드는 전역 `MBP`를 제공합니다. [jsDelivr](https://www.jsdelivr.com/package/npm/meta-buffer-pack)에서도 사용할 수 있으며, CDN URL을 선택할 때 패키지 버전을 고정하세요.

### 브라우저: ES module

HTTP로 파일을 제공하고 import 경로에 `.js` 확장자를 유지합니다.

```html
<script type="module">
  import MBP from './dist/meta-buffer-pack.js';
  const packet = MBP.pack(MBP.MB('message', 'hello'));
  console.log(MBP.unpack(packet).message); // 'hello'
</script>
```

## MB로 필드 만들기

`MB`는 `metaBuffer`의 별칭이며 `[name, type, buffer]` 튜플을 반환합니다.

| 호출 | 의미 |
| --- | --- |
| `MB(name, value)` | 값에서 저장 타입 추론 |
| `MB(name, type, number)` | 명시한 타입으로 숫자 인코딩 |
| `MB(name, size, fill)` | `size` 바이트 Buffer를 만들고 `fill`로 채움 (0–255 사용) |

세 번째 인자가 있으면 숫자인 두 번째 인자의 의미가 달라집니다.

```js
import MBP from 'meta-buffer-pack';

const packet = MBP.pack(
  MBP.MB('count', 4),          // 숫자 4를 텍스트로 저장
  MBP.MB('zeros', 4, 0),      // 0으로 채운 4바이트
  MBP.MB('signed', 'i16', -31234),
  MBP.MB('littleEndian', '16L', 0x1234),
  MBP.MB('large', '32', 4200000000),
  MBP.MB('pi', 'f', 3.141592)
);

const result = MBP.unpack(packet);
console.log(result.count);              // 4
console.log([...result.zeros]);         // [0, 0, 0, 0]
console.log(result.signed);             // -31234
console.log(result.littleEndian);       // 4660
console.log(result.large);              // 4200000000
console.log(result.pi);                 // 3.141592025756836
```

### 지원 값과 디코딩 결과

| 입력 | 저장 형식 | 디코딩 결과 |
| --- | --- | --- |
| `number` 또는 명시적 `N` | `String(value)`의 UTF-8 텍스트 | JavaScript number |
| 명시적 `8`, `16`, `32` | 부호 없는 정수, 1/2/4바이트 | JavaScript number |
| 명시적 `I8`, `I16`, `I32` | 부호 있는 정수, 1/2/4바이트 | JavaScript number |
| 명시적 `F` | IEEE 754 Float32, 4바이트 | Float32 정밀도의 JavaScript number |
| `string` | UTF-8 (`S`) | string |
| `boolean` | 1바이트 (`!`): 0 또는 1 | boolean |
| `null` | JSON 텍스트 (`O`) | null |
| 배열 또는 JSON 호환 객체 | JSON 텍스트 (`O`) | 파싱된 배열 또는 객체 |
| Buffer, Uint8Array, ArrayBuffer, 다른 TypedArray, DataView | 원시 바이트 (`B`) | Buffer |

숫자 타입 코드는 대소문자를 구분하지 않습니다. `I`는 부호 있는 정수, `L`은 16/32비트 정수와 Float32의 리틀 엔디안을 선택합니다. `L`이 없으면 빅 엔디안입니다. 예를 들어 `16L`, `I32L`, `FL`을 지원합니다. 1바이트 값에는 엔디안 구분이 없습니다.

`S`, `B`, `O`, `!`는 추론된 필드를 설명하는 메타데이터 타입 코드입니다. 해당 필드는 `MB(name, value)`로 만드세요. 타입을 명시하는 3인자 형식은 숫자에 사용합니다.

주요 제한 사항:

- 명시적 바이너리 숫자 타입에는 Float64와 64비트 정수가 없습니다. 정수는 선택한 타입의 범위 안에 있어야 합니다.
- 일반 숫자는 텍스트 표현으로 `NaN`과 무한대를 보존하지만 `-0`은 `0`이 됩니다.
- 객체는 JSON 규칙을 따릅니다. Date는 문자열이 되고 Map/Set의 내용은 기본적으로 보존되지 않으며 클래스 프로토타입은 사라집니다. 중첩된 `undefined`는 JSON의 생략/null 규칙을 따릅니다.
- BigInt, 함수, symbol, `undefined`는 직접적인 MB/MBA 값으로 지원하지 않습니다. BigInt나 순환 참조를 포함한 객체도 일반 JSON 직렬화로 인코딩할 수 없습니다.
- TypedArray의 원소 타입은 보존하지 않습니다. 여러 바이트를 쓰는 TypedArray는 엔디안 변환 없이 기존 메모리 바이트를 저장하고 Buffer로 디코딩합니다.

### Buffer 복사와 공유

`MB(name, uint8Array)`는 일반 Uint8Array를 복사합니다. `MBP.Buffer` 인스턴스는 튜플 생성 시 그대로 사용하며, ArrayBuffer와 다른 typed view는 이 단계에서 원래 메모리를 공유합니다. Node.js의 native Buffer와 `MBP.Buffer`는 다른 구현이므로 native Buffer는 Uint8Array 복사 경로를 사용할 수 있습니다.

`pack()`은 필드 바이트를 새 버퍼로 복사합니다. `unpack()`은 Buffer/Uint8Array 입력을 복사하지만 ArrayBuffer 입력은 복사 없이 감쌉니다. 디코딩한 바이너리 필드는 디코딩 버퍼의 view입니다. `getBuffer()`는 전달한 패킷의 view를 반환합니다.

## MBA로 인자 패킹하기

`MBA(...args)`는 숫자 인덱스를 이름으로 사용하는 필드를 만듭니다. 디코딩 후 숫자 프로퍼티와 `args` 배열로 값에 접근하며 `$`는 같은 배열의 별칭입니다.

```js
import MBP from 'meta-buffer-pack';

const values = ['hi', 2332, 22.2, [1, 2, 3], { hi: 'yeh' }, true, 0, false, '', null];
const packet = MBP.pack(MBP.MBA(...values));
const result = MBP.unpack(packet);

console.log(result.args[0]); // 'hi'
console.log(result.$[1]);    // 2332
console.log(result.args[6]); // 0
console.log(result.args[7]); // false
console.log(result.args[8]); // ''
console.log(result.args[9]); // null
console.log(result.args === result.$); // true
```

이름이 있는 필드와 하나의 MBA 목록을 함께 사용할 수 있습니다.

```js
import MBP from 'meta-buffer-pack';

const packet = MBP.pack(
  MBP.MB('greeting', 'hello'),
  MBP.MB('coffee', 'mocha'),
  MBP.MBA('a1', 'a2', 3)
);
const result = MBP.unpack(packet);
console.log(result.greeting); // 'hello'
console.log(result.coffee);   // 'mocha'
console.log(result.args);     // ['a1', 'a2', 3]
```

패킷마다 MBA 목록은 하나만 사용하세요. 여러 목록은 각각 인덱스 0부터 시작하므로 앞의 값을 덮어씁니다. 빈 MBA 목록은 `args`나 `$`를 만들지 않습니다.

## 필드 이름과 메타데이터 생략

- 이름은 문자열 또는 음수가 아닌 안전한 정수 인덱스입니다. 일반 필드는 서로 다른 문자열 이름을 사용하세요.
- 이름이 중복되면 나중에 디코딩한 값이 앞의 값을 덮어씁니다. `0`과 `'0'`처럼 숫자와 같은 숫자의 문자열은 같은 객체 프로퍼티입니다.
- 인덱스 필드 사용 시 `args`와 `$`는 피하세요. 생성되는 인자 배열이 해당 값을 덮어씁니다. 외부 메타데이터로 원시 바이트를 디코딩할 때는 생성되는 잔여 바이트가 덮어쓰는 `$OTHERS`도 피하세요.
- 0부터 연속되는 숫자 프로퍼티가 인자 배열을 만들며 첫 누락 인덱스에서 멈춥니다. MBA 사용 시 관계없는 필드에 이 이름을 쓰지 마세요.
- 빈 문자열 이름 또는 `#`가 포함된 이름은 해당 필드의 메타데이터를 생략합니다. 데이터 바이트는 패킷에 남지만 `unpack()`이 자동으로 복원할 수 없습니다.
- 모든 필드의 메타데이터를 생략하면 `pack()`은 footer 없이 원시 바이트만 출력합니다. 올바른 디코딩을 위해 외부 메타데이터를 제공하세요.

## 원시 바이트와 외부 메타데이터

`meta(...fields)`는 MB 튜플에서 메타데이터를 만들고 `getMeta(packet)`은 패킷에서 메타데이터를 추출합니다. `rawPack(...fields)`는 데이터 바이트만 만들며 `getBuffer(packet)`은 패킷의 데이터 바이트를 추출합니다.

메타데이터 항목은 `[name, type, offset, length]` 형식입니다. 오프셋과 길이는 바이트 단위입니다. 고정 크기 숫자와 boolean은 길이를 생략할 수 있지만 가변 크기 필드는 길이가 필요합니다.

```js
import MBP from 'meta-buffer-pack';

const fields = [MBP.MB('id', '16L', 7), MBP.MB('label', 'hello')];
const metadata = MBP.meta(...fields);
const raw = MBP.rawPack(...fields);
console.log(MBP.unpack(raw, metadata).label); // 'hello'

// 알려진 헤더 뒤에 가변 크기 payload가 오는 경우
const incoming = MBP.Buffer.from([0, 7, 10, 20, 30]);
const result = MBP.unpack(incoming, [['id', '16', 0]]);
console.log(result.id);           // 7
console.log([...result.$OTHERS]); // [10, 20, 30]
```

외부 메타데이터를 사용하면 `$OTHERS`는 필드 끝 위치 중 가장 큰 위치 뒤의 잔여 바이트를 담습니다. 필드 사이의 빈 공간을 모으지는 않습니다. 뒤에 남은 바이트가 없으면 `$OTHERS`를 만들지 않습니다.

## 바이너리 형식과 크기 제한

메타데이터가 있는 필드가 하나 이상이면 다음 형식을 사용합니다.

```text
[필드 바이트를 이어 붙인 데이터]
[[name, type, offset, length] 항목들의 UTF-8 JSON 배열]
[JSON 바이트 길이: 부호 없는 16비트 빅 엔디안]
```

`MBP.pack(MBP.MB('x', '8', 1))`의 예:

```text
Data:     01                          (1바이트)
Metadata: [["x","8",0,1]]             (UTF-8 15바이트)
Footer:   00 0f                       (2바이트)
Total:    18바이트
```

**65,535바이트** 제한은 메타데이터 길이에 적용됩니다. 전체 패킷의 제한이 아닙니다. 더 큰 메타데이터를 패킹하면 RangeError가 발생합니다. payload 크기도 실행 환경의 Buffer와 메모리 한도를 따릅니다.

패킷 크기는 payload 바이트 + 메타데이터 바이트 + footer 2바이트입니다. 작은 메시지는 JSON보다 클 수 있습니다. 위 예는 18바이트지만 `{"x":1}`은 UTF-8 7바이트입니다. MBP는 데이터를 압축하지 않습니다.

내장 메타데이터 디코딩에는 패킷의 끝 위치가 필요합니다. TCP 같은 바이트 스트림에서는 패킷 경계를 구분하는 별도 프레이밍이 필요합니다. 형식에는 magic signature, 버전 필드, checksum이 없으며 메타데이터 파싱은 무결성이나 진위 검사가 아닙니다.

## 디코딩과 오류 처리

`unpack()`은 성공 시 객체를 반환합니다. 메타데이터가 없거나 유효하지 않은 경우, 필드가 데이터 영역을 벗어난 경우, 디코딩할 수 없는 경우에는 `undefined`를 반환하며 부분 객체를 반환하지 않습니다. MBA 인자를 포함해 `null`, `0`, `false`, 빈 문자열을 보존합니다.

메타데이터 검증은 모든 항목의 이름, 인식 가능한 타입, 오프셋, 길이를 확인합니다. 고정 크기 필드의 길이는 타입과 일치해야 하며 내장 메타데이터는 메타데이터/footer 영역을 가리킬 수 없습니다.

패킹 오류는 `undefined`를 반환하지 않고 예외를 던집니다. 지원하지 않는 직접 입력 값, `NB()`의 미지원 숫자 타입, 범위를 벗어난 정수, 너무 큰 메타데이터, JSON 직렬화가 불가능한 객체 등이 해당합니다.

디코딩한 바이너리 값은 Buffer 인스턴스입니다. `{"type":"Buffer","data":[1,2,3]}`는 Buffer의 JSON 표현이며 원래 실행 중인 값 자체가 아닙니다. `MBP.Buffer.isBuffer(value)`로 확인하거나 바이트를 직접 살펴보세요.

## API 참조

모든 런타임 API는 ESM 기본 export 또는 CommonJS 모듈인 `MBP`의 프로퍼티입니다. ESM named value export는 없습니다.

| API | 목적 / 결과 |
| --- | --- |
| `MB(name, value)` / `metaBuffer` | `[name, type, Buffer]` 생성; 위의 숫자 3인자 형식도 지원 |
| `MBA(...values)` / `metaBufferArguments` | 숫자 인덱스를 이름으로 하는 MB 튜플 목록 생성 |
| `NB(type, value = 0)` / `numberBuffer` | 숫자 하나를 Buffer로 인코딩 |
| `pack(...fieldsOrLists)` | MB 튜플과 목록을 패킷으로 결합 |
| `unpack(bytes, metadata?)` | 객체로 디코딩하거나 `undefined` 반환 |
| `meta(...fieldsOrLists)` | 필드에서 메타데이터 생성; 없으면 `undefined` |
| `metaDetail(...fieldsOrLists)` | 전체 타입 이름을 사용하는 메타데이터 생성 |
| `getMeta(packet, showDetail = false)` | 메타데이터 추출; 없으면 `undefined` |
| `getMetaDetail(packet)` | 전체 타입 이름으로 메타데이터 추출 |
| `rawPack(...fieldsOrLists)` | 필드를 패킹하고 원시 데이터 바이트 추출 |
| `getBuffer(packet)` | 데이터 영역의 view 반환; Buffer/Uint8Array 입력 지원 |
| `getBufferSize(packet)` | 감지한 원시 데이터 크기 반환 |
| `getMetaSize(packet)` | 유효한 메타데이터 크기 또는 0 반환 |
| `readTail(packet)` | 끝의 2바이트 길이를 읽음; 메타데이터는 검증하지 않음 |
| `parseMetaInfo(packet, infoSize?)` | 메타데이터 파싱·검증; 크기 생략 시 footer에서 읽음 |
| `parseTypeName(type)` | 타입 코드 확장; 예: `16L` → `uint16_le` |
| `readTypedBuffer(type, buffer, offset, length?)` | 필드 하나를 읽거나 `undefined` 반환 |
| `U8(data, shareArrayBuffer = false)` / `parseUint8Array` | Uint8Array로 변환 |
| `B8(data, shareArrayBuffer = false)` / `parseBuffer` | Buffer로 변환 |
| `U8pack(...data)` / `parseUint8ThenConcat` | Uint8Array로 변환·연결; 변환 실패 시 `undefined` |
| `B8pack(...data)` / `parseBufferThenConcat` | Buffer로 변환·연결 |
| `hex(bytes)` | 16진수 문자열 반환 |
| `equal(a, b)` | Buffer/Uint8Array 바이트 비교 |
| `Buffer` | 포함된 Buffer 생성자 |
| `TAIL_LEN` | footer 길이: 2 |

상세 메타데이터는 튜플의 다섯 번째 원소에 전체 타입 이름을 추가합니다. 이 메타데이터도 `unpack()`에 전달할 수 있습니다.

`U8`과 `B8`은 변환 도구이며 MB 직렬화를 대신하지 않습니다. 숫자는 1바이트, 문자열은 UTF-8, 일반 객체는 JSON으로 변환합니다. `shareArrayBuffer = true`이면 ArrayBuffer와 view 입력이 메모리를 공유하고 기본값에서는 복사합니다. 연결 도구는 메타데이터를 추가하지 않습니다.

## TypeScript

타입 선언은 ESM 기본 export와 직접 사용하는 CommonJS API에 맞춰져 있습니다. Node.js 프로젝트는 NodeNext 해석을, 호환 번들러를 사용하는 프로젝트는 Bundler 해석을 사용하세요. Buffer 선언은 Node 타입을 참조하므로 없는 프로젝트는 개발 의존성으로 `@types/node`가 필요할 수 있습니다.

```ts
// ESM (.mts 또는 ESM 패키지의 .ts)
import MBP, { type MetaBufferTuple } from 'meta-buffer-pack';

const field: MetaBufferTuple = MBP.MB('id', '16L', 7);
const metadata = MBP.meta(field);
const value = MBP.unpack(MBP.rawPack(field), metadata);
if (value !== undefined) console.log(value.id); // 7
```

```ts
// CommonJS (.cts)
import MBP = require('meta-buffer-pack');

const field: MBP.MetaBufferTuple = MBP.MB('id', '16L', 7);
const value = MBP.unpack(MBP.pack(field));
if (value !== undefined) console.log(value.id); // 7
```

타입 선언은 API를 설명하지만 패킷에서 디코딩되는 필드 이름과 값의 타입을 추론하지는 않습니다. 필요한 경우 애플리케이션의 구조를 별도로 검증하세요.

## 예제와 개발

[example/index.html](example/index.html)은 브라우저 UMD와 ESM 사용 예제입니다. Node.js ESM/CommonJS 예제는 위에 있습니다.

[온라인 데모](https://remocons.github.io/meta-buffer-pack/index.html)도 있으며 배포된 버전은 로컬 checkout과 다를 수 있습니다.

저장소 checkout에서 실행합니다.

```sh
npm install
npm run build
npm test
npm run test:types
```

소스 변경이 배포 파일에 반영되도록 테스트 전에 빌드하세요. 테스트는 공개 빌드와 소스 회귀 동작을 확인하며 타입 검사는 ESM/CommonJS import를 확인합니다.

## 용어

| 용어 | 의미 |
| --- | --- |
| MB | Meta Buffer: `[name, type, buffer]` 튜플 |
| MBA | 함수 형태의 인자로 만든 MB 튜플 목록 |
| MBP 패킷 | 결합된 필드 바이트; 선택적으로 메타데이터와 footer가 뒤에 붙음 |
| MBO | `unpack()`이 반환하는 객체 |

## 라이선스

[MIT](LICENSE)
