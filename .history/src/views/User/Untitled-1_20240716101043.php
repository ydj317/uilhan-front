
<?php 
public function gmarket(): JsonResponse
{
    $key = 'XXXXXXXXX';
    $header = [
        "alg"=> "HS256",
         "typ"=> "JWT",
        "kid"=> "arobot77"
    ];

    $header_json = json_encode($header, JSON_UNESCAPED_SLASHES);
    $header_base64url = $this->base64UrlEncode($header_json);

    $payload = [
        "iss" => "https://smart-plan.co.kr",
        "sub" => "sell",
        "aud" => "sa.esmplus.com",
        "ssi" => "G:kss07131,A:arobot77"
    ];
    $payload_json = json_encode($payload, JSON_UNESCAPED_SLASHES);
    $payload_base64url = $this->base64UrlEncode($payload_json);

    $signature = hash_hmac('sha256', $header_base64url . "." . $payload_base64url, $key, true);
    $signature_base64url = $this->base64UrlEncode($signature);


    $jwt = $header_base64url . "." . $payload_base64url . "." . $signature_base64url;
    print_r($jwt);
    //var_dump();
    //var_export();
    exit;
}

private function base64UrlEncode($data): string
{
    // 使用 base64_encode 编码数据
    $base64 = base64_encode($data);

    // 替换 URL 不安全的字符，并去掉填充的 '='
    $base64url = strtr($base64, '+/', '-_');
    return rtrim($base64url, '=');
}