package br.com.rafael.instagram.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private String status;
    private String codigo;
    private String mensagem;
    private T dados;

    public ApiResponse(String status, String codigo, String mensagem, T dados) {
        this.status = status;
        this.codigo = codigo;
        this.mensagem = mensagem;
        this.dados = dados;
    }

    public static <T> ApiResponse<T> sucesso(String codigo, String mensagem, T dados) {
        return new ApiResponse<>("sucesso", codigo, mensagem, dados);
    }

    public static <T> ApiResponse<T> erro(String codigo, String mensagem) {
        return new ApiResponse<>("erro", codigo, mensagem, null);
    }

    public String getStatus() { return status; }
    public String getCodigo() { return codigo; }
    public String getMensagem() { return mensagem; }
    public T getDados() { return dados; }
}

