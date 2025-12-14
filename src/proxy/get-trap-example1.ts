{
    const logger = {
        log: (message: string) => console.log(message),
        debug: (message: string) => console.debug(message),
        warn: (message: string) => console.warn(message),
        error: (message: string) => console.error(message),
    }

    const loggerProxy = new Proxy(logger, {
        get(target, property, receiver) {
            switch (property) {
                case 'log':
                    return (msg: string) => {
                        target.log(`[LOG] ${msg}`);
                    }
                case 'debug':
                    return (msg: string) => {
                        console.debug(`[DEBUG] 디폴트 메세지`);
                    }
                // ⚠️ Proxy는 메서드 호출을 가로채서 구현, 반환값, 매개변수를 변경할 수 있지만,
                // 함수를 상수(문자열, 숫자 등)로 바꾸는 것은 불가능함
                // 컴파일은 통과하지만 호출 시 런타임에서 에러 발생
                case 'warn':
                    return '함수가 아닌 값 반환';
                // 원본과 다른 시그니처지만, 함수 형태를 유지했기 때문에 런타임 에러 없음
                // ⚠️ 다만 실무에서는 이런 방식보다 원본 메서드를 활용하는 게 일반적
                case 'error':
                    return () => {
                        return '[ERROR] 디폴트 메세지';
                    }
            }

            return Reflect.get(target, property, receiver);
        }
    });

    console.log(loggerProxy);
    loggerProxy.log('log 호출'); // [LOG] log 호출
    loggerProxy.debug('debug 호출'); // [DEBUG] 디폴트 메세지
    //loggerProxy.warn('warn 호출'); // Runtime Error 발생
    console.error(loggerProxy.error('error 호출')); // [ERROR] 디폴트 메세지
}