import React from 'react';
import { Route, /*IndexRedirect*/ } from 'react-router';
//import Root from './Root';
//import PHome from './pages/PHome';
import PList from './pages/PList';


export default (
    <Route path="/" component={PList} />
    /*<Route exact={true} path="/home" component={PHome} />
    <Route exact={true} path="/list" component={PList} />
</Route>*/
)

// export default class Routes extends React.Component{
//     render () {
//         return [
//             <Route exact={true} path="/home" component={PHome} />,
//             <Route exact={true} path="/list" component={PList} />
//         ]
//     }
// }
