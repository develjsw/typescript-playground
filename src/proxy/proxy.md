## Proxy 객체

### Proxy란?
- 객체 ( 또는 클래스, 인스턴스 ) 에 대한 접근을 가로채 속성 접근, 값 할당, 함수 호출 등의 동작을 동적으로 재정의할 수 있는 JS 기능
  - ⚠️ Proxy는 상속 기반의 오버라이딩이 아님, 객체의 속성 접근 자체를 가로채서 반환값을 교체하는 방식임

### 핵심 개념
- 기존 객체를 직접 수정하지 않음
- 특정 속성 접근 시 다른 값 / 다른 함수로 바꿔치기 가능
- 런타임에서 동작을 변경할 수 있음
    ```ts
    const proxy = new Proxy(target, handler);
    // target: 가로채기 대상이 되는 원본 객체
    // handler: trap(가로채기 메서드)들을 정의한 객체
    ```

### Trap (트랩)
- Proxy handler 객체에서 사용하는 **가로채기 메서드**
- 객체 동작을 가로채서 커스텀 로직을 실행할 수 있음

#### 📋 Trap 전체 목록

| Trap | 가로채는 동작 | 예시 |
|------|-------------|------|
| `get(target, property, receiver)` | 속성 읽기 | `obj.property`, `obj['property']` |
| `set(target, property, value, receiver)` | 속성 쓰기 | `obj.property = value` |
| `has(target, property)` | `in` 연산자 | `'property' in obj` |
| `deleteProperty(target, property)` | 속성 삭제 | `delete obj.property` |
| `apply(target, thisArg, args)` | 함수 호출 | `fn(...args)` |
| `construct(target, args, newTarget)` | `new` 연산자 | `new Fn(...args)` |
| `getPrototypeOf(target)` | 프로토타입 조회 | `Object.getPrototypeOf(obj)` |
| `setPrototypeOf(target, proto)` | 프로토타입 설정 | `Object.setPrototypeOf(obj, proto)` |
| `isExtensible(target)` | 확장 가능 여부 | `Object.isExtensible(obj)` |
| `preventExtensions(target)` | 확장 방지 | `Object.preventExtensions(obj)` |
| `getOwnPropertyDescriptor(target, property)` | 속성 설명자 조회 | `Object.getOwnPropertyDescriptor(obj, property)` |
| `defineProperty(target, property, desc)` | 속성 정의 | `Object.defineProperty(obj, property, desc)` |
| `ownKeys(target)` | 키 목록 조회 | `Object.keys(obj)`, `for...in` |

---

## Reflect

### Reflect란?
- Proxy Trap과 1:1 대응되는 메서드를 제공하는 JavaScript 내장 객체
- **Proxy 내부에서 원본 동작을 안전하게 호출**할 때 사용

### 왜 필요한가?
- Proxy Trap 내부에서 원본 동작을 유지할 때 `target[property]` 직접 접근하면 **`this` 바인딩 문제** 발생 가능
- `Reflect.get(target, property, receiver)` 사용하면 안전한 동작 보장

### 사용 패턴

```typescript
const user = { name: '홍길동', age: 30 };

const proxy = new Proxy(user, {
    get(target, property, receiver) {
        // 특정 속성만 가로채서 커스텀 값 반환
        if (property === 'name') {
            //return `${target[property]} 사원`
            return `${target.name} 사원`;
        }

        // 나머지는 원본 동작 유지 (Reflect 사용)
        return Reflect.get(target, property, receiver);
    }
});

console.log(proxy.name);  // "홍길동 사원" (커스텀)
console.log(proxy.age);   // 30 (원본)
```
