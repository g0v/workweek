require('shelljs/global');

rm('-rf', 'out');
exec('git clone "https://' + env.GH_TOKEN +
     '@' + env.GH_REF + '" --depth 1 -b gh-pages out');
pushd('out');
exec('git config user.name "Automatic Commit"');
exec('git config user.email "workweek@g0v.tw"');
exec('git rm -rf .');
cp('-r', '../dist/', '.');
exec('git add .');
exec('git commit -m "Automatic commit: ' + Date() + '"');
exec('git push "https://' + env.GH_TOKEN +
     '@' + env.GH_REF + '" gh-pages', {silent: true});
popd();
exit(0);
