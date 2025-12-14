/**
 * set trap 호출 시점 : 객체 속성에 값을 할당할 때 호출
 */
{
    const payment = {
        user: { name: '홍길동', age: 21, address: '서울시 00구 00동' },
        goods: { name: '상품1', price: 250000 },
        status: 'PENDING',
    }

    const paymentProxy = new Proxy(payment, {
        set(target, property, newValue, receiver) {

            if (property === 'status') {

                if (target.status === newValue) {
                    throw new Error('동일한 상태값으로 변경은 불가능합니다.');
                }

                if (target.status === 'COMPLETE' && newValue === 'PENDING') {
                    throw new Error('이전 단계로 변경은 불가능합니다.');
                }
            }

            return Reflect.set(target, property, newValue, receiver);
        }
    });

    //paymentProxy.status = 'PENDING'; // Runtime Error - 동일한 상태값으로 변경은 불가능합니다.
    paymentProxy.status = 'COMPLETE';

    console.log(payment); // { ..., status: 'COMPLETE' } - Proxy를 통한 변경이 원본에 반영됨
    console.log(paymentProxy); // { ..., status: 'COMPLETE' } - Proxy는 원본 객체의 래퍼이므로 동일한 데이터를 참조
}