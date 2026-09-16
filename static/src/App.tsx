import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Default as DefaultLayout } from '@layouts/Default';
import { Home } from '@pages/Home';
import { Contact } from '@pages/Contact';
import { NotFound } from '@pages/NotFound';
import { injectWpGlobalStyles } from '@lib/wp-global-styles';
import './index.css';

injectWpGlobalStyles();

const App = () => {
    useEffect(() => {
        import('@scripts/app.js');
    }, []);

    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <DefaultLayout>
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/contact"
                        element={<Contact />}
                    />
                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </DefaultLayout>
        </BrowserRouter>
    );
};

createRoot(document.getElementById('root')!).render(<App />);

export default App;
