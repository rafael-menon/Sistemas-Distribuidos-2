package br.com.rafael.instagram;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Scanner;

@SpringBootApplication
public class InstagramApplication {
    public static void main(String[] args) {
        if (System.getProperty("server.port") == null) {
            String porta = "20000"; 
            
            try {
                Scanner scanner = new Scanner(System.in);
                System.out.print("Qual o servidor deve utilizar? (Pressione Enter para usar 20000): ");
                String userInput = scanner.nextLine();

                if (userInput != null && !userInput.trim().isEmpty()) {
                    porta = userInput;
                }
            } catch (Exception e) {
                System.out.println("Erro ao ler a entrada. Assumindo porta padrão: 20000.");
            }

            System.setProperty("server.port", porta);
            System.out.println("Iniciando na porta " + porta + "...");
        }

        SpringApplication.run(InstagramApplication.class, args);
    }
}