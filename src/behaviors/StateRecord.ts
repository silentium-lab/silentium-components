import {
  Actual,
  DestroyContainer,
  MaybeMessage,
  Message,
  MessageType,
  Value,
} from "silentium";

export function StateRecord(
  state$: MessageType,
  values$: MessageType,
  sequence: MaybeMessage<unknown[]>,
) {
  const dc = DestroyContainer();
  let stateIndex = -1;
  let latestState: string | null = null;
  let result: Record<string, unknown> = {};
  const sequence$ = Value(Actual(sequence));
  return Message(function StateRecordImpl(resolve, reject) {
    dc.add(
      state$
        .then(function stateRecordStateSub(state) {
          if (state === sequence$.value?.[stateIndex + 1]) {
            stateIndex += 1;
            latestState = state as string;
          } else {
            stateIndex = -1;
            latestState = null;
            result = {};
          }
        })
        .catch(reject),
    );
    dc.add(
      values$
        .then(function stateRecordValuesSub(value) {
          if (latestState !== null) {
            result[latestState] = value;
          }
          if (stateIndex + 1 === sequence$.value?.length) {
            resolve(result);
            stateIndex = -1;
            latestState = null;
            result = {};
          }
        })
        .catch(reject),
    );
    return function StateRecordDestroy() {
      dc.destroy();
    };
  });
}
