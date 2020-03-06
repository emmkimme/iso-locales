import { prerequisites } from './prerequisites';
import { information } from './information';

prerequisites()
.then(() => {
    information();
});