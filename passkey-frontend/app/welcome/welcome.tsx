export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-12 min-h-0 max-w-2xl px-4">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Passkey Auth Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Experience the Future of Authentication
          </p>
        </header>

        <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
          This demo app showcases passwordless authentication using passkeys
          &mdash; the modern, phishing-resistant replacement for passwords.
          Register an account, create a passkey, and see how seamless and
          secure authentication can be.
        </p>

        <section className="w-full rounded-3xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            What Are Passkeys?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Passkeys are a new standard for authentication built on public-key
            cryptography. Instead of a shared secret like a password, passkeys
            use a unique key pair for every account:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong className="text-gray-900 dark:text-white">Key pair generation</strong>{" "}
              &mdash; when you register, your device creates a public/private
              key pair.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Public key on the server</strong>{" "}
              &mdash; only the public key is sent to and stored by the server.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Private key on your device</strong>{" "}
              &mdash; the private key never leaves your device, protected by
              biometrics or a PIN.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Challenge signing</strong>{" "}
              &mdash; during login the server sends a random challenge; your
              device signs it with the private key, proving your identity
              without transmitting a secret.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
