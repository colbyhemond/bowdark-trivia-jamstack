import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import randomToken  from "random-token";



export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
        },
        session: { jwt: true },
        async authorize(credentials, req) {
          console.log('Logging Credentials 🔒');
          let user

          //Generate data for anonymous user so that we can try and retain sessions when returning
          user = { id: req.query.localId, name: "Anonymous Bowdork", localId: req.query.localId }
 
          // Add logic here to look up the user from the credentials supplied

          const response = await fetch('http://localhost:3000/api/user?' + new URLSearchParams({
            localId: user.localId
          }))

          if (response.status == '200') {
            console.log(`User ${user.localId} was found`);
          } else {
            console.error(`User ${user.localId} not found`);
          }

          const data = await response.json()

          if (data.length > 0) {
            user = data[0]
          } else {
            const response = await fetch('http://localhost:3000/api/user', {
              method: 'POST',
              body: JSON.stringify({
                  localId: user.localId,
                  name: user.name
              })
            })
        
            if (response.status == '201') {
              console.log(`User ${user.localId} was created`);
            } else {
              console.error(`Error creating User ${user.localId}`);
            }
          }
      
          
          
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null
    
            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        },
      })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
          console.log('signin....');
          // console.log(user);
          // user = {
          //   id: 'ltow2ft04anti7xu',
          //   name: 'C Hemond',
          //   email: 'chemond@example.com'
          //   localId: 'xAxEMb5ywBdSKicwvybRb5TakLtJEvg4'
          // }

          // console.log(account);
          // account = {
          //   providerAccountId: 'ltow2ft04anti7xu',
          //   type: 'credentials',
          //   provider: 'credentials'
          // }
          // console.log(profile);
          // profile = undefined
          // console.log(email);
          // email = undefined
          // console.log(credentials);
          // credentials = [Object: null prototype] {
          //   csrfToken: '8f34461b45c0e44e7f493cbfddff4efad94729030809847cdc4b1cabb368e768',
          //   username: 'testing',
          //   password: 'testing'
          // }
          
          return true
        },
        async jwt({ token, account, profile, isNewUser }) {
          console.log('--jwt Callback--');
          // console.log(token);
          // token = {
          //   name: 'C Hemond',
          //   email: 'chemond@example.com',
          //   picture: undefined,
          //   sub: 'ltow2ft04anti7xu'
          // }
          // console.log(account);
          // account = {
          //   providerAccountId: 'ltow2ft04anti7xu',
          //   type: 'credentials',
          //   provider: 'credentials'
          // }
          // console.log(profile);
          // profile = undefined
          // console.log(isNewUser);
          // isNewUser = false
          
          return token
        },
        async session({session, token, user}) {
          console.log('--Session Callback--');

          // SESSION
          // console.log(session);
          // session = {
          //   user: { name: 'C Hemond', email: 'chemond@example.com', image: undefined },
          //   expires: '2023-01-25T17:48:35.993Z'
          // }
          session.user = {
            name: session.user.name,
            email: session.user.email,
            //Add custom properties below
            localId: session.user.localId
          }

          // TOKEN
          // console.log(token);
          // token = {
          //   name: 'C Hemond',
          //   email: 'chemond@example.com',
          //   sub: 'ltow2ft04anti7xu',
          //   iat: 1672076915,
          //   exp: 1674668915,
          //   jti: '887f7812-7a55-4c58-9ac2-305486f0cda2'
          // }

          // USER
          // console.log(user);
          // user = undefined

          return session
        }
    }
}
export default NextAuth(authOptions)