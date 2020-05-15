export default function ({ redirect }) {
    let auth = localStorage.getItem("auth")

    if ( auth !== null ) {
        return redirect('/dashboard')
    }
}