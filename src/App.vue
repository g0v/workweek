<template>
  <div id="app">
    <nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" v-link="{ path: '/'}">g0v 勞基法專題</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li v-bind:class="{'active': $route.name === 'workweek'}"><a v-link="{ path: '/'}">勞基法計算機 <span class="sr-only">(current)</span></a></li>
        <li v-bind:class="{'active': $route.name === 'faq'}"><a v-link="{ path: '/faq' }">常見疑問</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
    <div class="jumbotron">
      <div class="container">
        <h1><span class="glyphicon glyphicon-wrench"></span>勞基法計算機</h1>
        <p>
          沒人搞得清楚這次修法正確的計算方式，不如來個計算機自己按一按吧。
        </p>
      </div>
    </div>
    <router-view></router-view>

    <div class="footer">
      本專案源碼於 <a href="https://github.com/g0v/workweek">g0v/workweek</a> 以 MIT 授權釋出，
      有任何問題請提交至 <a href="https://github.com/g0v/workweek/issues">issue tracker</a>
    </div>
    </div>
</template>

<script>
</script>

<style>
.footer {
  margin-top: 50px;
  padding: 5px;
  background: #EEE;
  text-align: center;
}
.navbar {
    margin-bottom: 0;
}
</style>
