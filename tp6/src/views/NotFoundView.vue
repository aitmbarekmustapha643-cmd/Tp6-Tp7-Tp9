// Même principe qu'au TP4 : un état partagé entre les deux vues avec reactive().
import { reactive } from 'vue'

export const store = reactive({
  students: [
    { id: 1, firstName: 'Yasmine', lastName: 'Alaoui', filiere: 'Génie Informatique', year: 2, email: 'y.alaoui@ensa.ma' },
    { id: 2, firstName: 'Omar', lastName: 'Bennis', filiere: 'Génie Aéronautique', year: 1, email: 'o.bennis@ensa.ma' },
    { id: 3, firstName: 'Salma', lastName: 'Cherkaoui', filiere: 'Génie Informatique', year: 3, email: 's.cherkaoui@ensa.ma' },
    { id: 4, firstName: 'Youssef', lastName: 'Idrissi', filiere: 'Génie Civil', year: 2, email: 'y.idrissi@ensa.ma' }
  ]
})
