// Route segment ISR — re-fetches product listing every 5 minutes in production
export const revalidate = 300;

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
