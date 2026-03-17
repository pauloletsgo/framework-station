export function Footer() {
  return (
    <footer className="border-t mt-auto py-8 px-4">
      <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
        <p>
          Framework Station &mdash; Ferramentas interativas de frameworks de negócios, marketing e estratégia.
        </p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()} frameworkstation.com.br
        </p>
      </div>
    </footer>
  );
}
