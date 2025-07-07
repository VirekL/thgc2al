import '../styles/styles.css';
import { DateFormatProvider } from '../components/DateFormatContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <DateFormatProvider>
      <Component {...pageProps} />
    </DateFormatProvider>
  );
}
