package flexguaraje_peru.back_end.seguridad;

import java.security.SecureRandom;

public class GeneradorPassSeguro {
    private static final String MAYUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String MINUSCULAS = "abcdefghijklmnopqrstuvwxyz";
    private static final String NUMEROS = "0123456789";
    private static final String CARACTERES_ESPECIALES = "!@#$%^&*()-_=+<>?";

    public static String generarContrasenaSegura() {
        SecureRandom random = new SecureRandom();
        StringBuilder contrasena = new StringBuilder();

        // Agregar 3 letras mayúsculas
        for (int i = 0; i < 3; i++) {
            contrasena.append(MAYUSCULAS.charAt(random.nextInt(MAYUSCULAS.length())));
        }

        // Agregar 2 caracteres especiales
        for (int i = 0; i < 2; i++) {
            contrasena.append(CARACTERES_ESPECIALES.charAt(random.nextInt(CARACTERES_ESPECIALES.length())));
        }

        // Agregar 3 números
        for (int i = 0; i < 3; i++) {
            contrasena.append(NUMEROS.charAt(random.nextInt(NUMEROS.length())));
        }

        // Rellenar con minúsculas hasta completar 15 caracteres
        while (contrasena.length() < 15) {
            contrasena.append(MINUSCULAS.charAt(random.nextInt(MINUSCULAS.length())));
        }

        // Mezclar los caracteres para mayor aleatoriedad
        return mezclarContrasena(contrasena.toString());
    }

    private static String mezclarContrasena(String contrasena) {
        SecureRandom random = new SecureRandom();
        char[] caracteres = contrasena.toCharArray();
        for (int i = 0; i < caracteres.length; i++) {
            int j = random.nextInt(caracteres.length);
            char temp = caracteres[i];
            caracteres[i] = caracteres[j];
            caracteres[j] = temp;
        }
        return new String(caracteres);
    }
}
