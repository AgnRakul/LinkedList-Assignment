function displayAllData() {
  var httpRequestForShowAll = new XMLHttpRequest(); // HTTPS CALLS

  function display(a, b, PostId) {
    let mainDiv = document.querySelector(".main-container");

    let card = document.createElement("div");
    card.className = "card card-3";
    mainDiv.appendChild(card);

    title = document.createElement("h4");
    title.className = "card__title";
    title.id = "cardTitle";
    title.innerHTML = `Blog Title: ${a}`;
    card.appendChild(title);

    description = document.createElement("p");
    description.className = "content";
    description.innerHTML = `Blog Content: ${b}`;
    description.id = "cardDescription";
    card.appendChild(description);

    descriptionTwo = document.createElement("p");
    descriptionTwo.className = "card__apply";
    descriptionTwo.id = "cardDescriptionTwo";
    card.appendChild(descriptionTwo);

    let button = document.createElement("button");
    button.innerHTML = "Delete";
    button.addEventListener("click", function () {
      httpRequestForShowAll.open(
        "DELETE",
        `http://localhost:8080/deleteBlog/${PostId}`,
        true
      );
      httpRequestForShowAll.send();
      console.log("Data Deleted");
    });
    descriptionTwo.appendChild(button);
  }

  httpRequestForShowAll.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let myData = JSON.parse(this.response);

      console.log(myData);
      for (let i = 0; i < myData.length; i++) {
        let t = myData[i].BlogTitle;
        let p = myData[i].BlogContent;
        let id = myData[i].Post_id;

        display(t, p, id); // Skeleton Template
      }
    }
  };
  httpRequestForShowAll.open("GET", "http://localhost:8080/allblog", true);
  httpRequestForShowAll.send();
}

function displayOne() {
  var httpRequestForOneData = new XMLHttpRequest();
  httpRequestForOneData.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let myData = JSON.parse(this.response);

      let mainDiv = document.querySelector(".main-container");

      let card = document.createElement("div");
      card.className = "card card-3";
      mainDiv.appendChild(card);

      title = document.createElement("h4");
      title.className = "card__title";
      title.id = "cardTitle";
        title.innerHTML = `Blog Title: ${myData.BlogTitle}`;
      card.appendChild(title);

      description = document.createElement("p");
      description.className = "content";
      description.innerHTML = `Blog Content: ${myData.BlogContent}`;
      description.id = "cardDescription";
      card.appendChild(description);

      descriptionTwo = document.createElement("p");
      descriptionTwo.className = "card__apply";
      descriptionTwo.id = "cardDescriptionTwo";
      card.appendChild(descriptionTwo);

      let button = document.createElement("button");
      button.innerHTML = "Prev";
      button.addEventListener("click", function () {
          httpRequestForOneData.open(
          "GET",
          `http://localhost:8080/getSingleBlog/${myData[0].prev}`,
          true
        );
          httpRequestForOneData.send();
      });
      descriptionTwo.appendChild(button);

      let button2 = document.createElement("button");
      button2.innerHTML = "Next";
      button2.addEventListener("click", function () {
          httpRequestForOneData.open(
          "GET",
          `http://localhost:8080/getSingleBlog/${myData[0].next}`,
          true
        );
          httpRequestForOneData.send();
      });
      descriptionTwo.appendChild(button2);
    }
  };

  httpRequestForOneData.open("GET", `http://localhost:8080/allblog`, true);
  httpRequestForOneData.send();
}
