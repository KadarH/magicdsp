export default function ({ redirect, app }) {
    let auth = app.$cookies.get('auth')


    if ( auth === null || auth === undefined ) {
        return redirect('/login')
    }
}  