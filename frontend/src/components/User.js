import React, { useState, useEffect } from 'react'
import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client'
import { Switch, Route, BrowserRouter as Router, Link } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { Page, Navigation, Top, AccountInfo } from '../styles/div'
import { TextPrimary, LinkText, InfoText } from '../styles/textStyles'


const ME = loader('../graphql/queries/me.graphql')

const User = (props) => {

    const  { data, error, loading } = useQuery(ME)
    const [ user, setUser ] = useState(null)

    useEffect(() => {
        if (data) {
        setUser(data.me);
    }
    else if (error) {
        props.showNotification(`Tapahtui virhe: ${error.message}`)
    } 
    }, [data])

    if (loading) {
        return (
            <div><p>Käyttäjätietoja haetaan</p></div>
        )
    }
    console.log('User Userissa: ', user); 
    return (
        <div>
                {user
                ?   <div>
                        <AccountInfo>
                            <LinkText to='/kirjaudu-ulos'>Kirjaudu ulos</LinkText>
                            {/* <InfoText>{user.name} kirjautuneena sisään</InfoText>  */}
                        </AccountInfo>
                        <Navigation>
                            <LinkText to='/tyopaivakirja'>Työpäiväkirja</LinkText>
                            <LinkText to='/vieraskirja'>Vieraskirja</LinkText> 
                        </Navigation>
                    </div>
                :   <div>
                        <AccountInfo><LinkText to='/kirjaudu'>Kirjaudu sisään</LinkText></AccountInfo>
                        <Navigation>
                            <LinkText to='/rekisteroidy'>Rekisteröidy</LinkText>
                        </Navigation>
                    </div>
                }
            
        </div>
    )
}
export default User