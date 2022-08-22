function ajax(url, method, data) {

  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error("error"));
        }
      }
    };
    if (method.toUpperCase() === "GET") {
  console.log(url, method, data);

      let paramsList = [];
      for (let key in data) {
        paramsList.push(key + "=" + data[key]);
      }
      let params = paramsList.join("&");
      url = url + "?" + params;
      xhr.open("get", url, false);
      xhr.send();
    } else if (method.toUpperCase() === "POST") {
      xhr.open("post", url, false);
      xhr.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded;charset=utf-8"
      );
      xhr.send(data);
    }
  });
}
