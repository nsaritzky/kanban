export const isAuthenticated = () =>
    document.cookie
        .split(";")
        .find((cookie) => cookie.startsWith("isAuthenticated"))
        ?.split("=")[1] === "true"
