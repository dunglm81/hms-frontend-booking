import { Subject } from 'rxjs';

const subject = new Subject();
export const dataService = {
    setData: (data) => subject.next({
        value: data
    }),
    clearData: () => subject.next(),
    getData: () => subject.asObservable()
};