const GITHUB_CLIENT_ID = 'b810301f4d209fd90b70';
const DEPLOYED_APP_URL = 'https://split.subsecond.app';

export default function getGithubAuthURL(
  userName?: string,
  repoName?: string,
  prNumber?: string
) {
  const redirectURL =
    userName == null || repoName == null || prNumber == null
      ? '/'
      : `/${userName}/${repoName}/pull/${prNumber}`;

  return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo&type=user_agent&redirect_uri=${DEPLOYED_APP_URL}${redirectURL}`;
}
