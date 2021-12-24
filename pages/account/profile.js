import React from 'react'

function profile() {
    return (
        <div>
            profile
        </div>
    )
}
export async function getServerSideProps(ctx) {
    console.log(ctx.req);
    return{
        props:{
            data:"data"
        }
    }
}
profile.auth=true
export default profile
