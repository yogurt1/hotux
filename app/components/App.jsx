import React, {Children} from 'react'
import {IntlProvider} from 'react-intl'
import {Provider as StoreProvider} from 'react-redux'

export default function App({
    children, store, locale
}) {
    return (
        <StoreProvider
            store={store}>
            <IntlProvider locale={locale}>
                {Children.only(children)}
            </IntlProvider>
        </StoreProvider>
    )
}
